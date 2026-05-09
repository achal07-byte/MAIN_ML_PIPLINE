from fastapi import APIRouter, HTTPException
from app.models.chat_models import ChatRequest, ChatResponse
from app.services.anthropic_client import get_claude_response
from app.services.data_analyzer import run_eda, get_eda_summary
from app.services.pipeline_state import get_pipeline_state, update_pipeline_state
from app.services.database import save_message, get_history, create_or_update_session
from app.services.chart_generator import generate_chart
from app.utils.prompt_templates import build_system_prompt
import os
import re
import pandas as pd

router = APIRouter()

@router.post("/", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    # Save user message
    save_message(request.session_id, "user", request.message)
    
    # Load current pipeline state
    state = get_pipeline_state(request.session_id)
    
    # Trigger EDA if state is missing or data_info is empty (first message or after reload)
    if (not state or not state.data_info) and request.session_file_path:
        try:
            if os.path.exists(request.session_file_path):
                print(f"DEBUG: Running EDA for session {request.session_id} on file {request.session_file_path}")
                df = pd.read_csv(request.session_file_path)
                eda_result = run_eda(df, request.session_id)
                state = update_pipeline_state(request.session_id, "eda", data_info=eda_result)
                create_or_update_session(
                    request.session_id, 
                    os.path.basename(request.session_file_path), 
                    request.session_file_path, 
                    "eda"
                )
                print("DEBUG: EDA completed successfully")
            else:
                print(f"WARNING: Session file not found at {request.session_file_path}")
        except Exception as eda_err:
            print(f"EDA ERROR: {str(eda_err)}")
    
    # Build history from database if provided history is empty
    current_history = request.history
    if not current_history:
        current_history = get_history(request.session_id)
    
    # Get EDA summary for context
    data_context = ""
    if state and state.data_info:
        data_context = get_eda_summary(state.data_info)
    
    # Get AI response
    try:
        reply, suggested_step = get_claude_response(
            user_message=request.message,
            system_prompt=build_system_prompt(data_context, state.step if state else "eda"),
            conversation_history=current_history,
            current_step=state.step if state else "eda"
        )
    except Exception as e:
        print(f"AI INVOCATION ERROR: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

    # --- Chart Generation ---
    # Detect [CHART: type] tags in the AI reply and generate visualizations
    images = []
    chart_pattern = r'\[CHART:\s*(\w+)\]'
    chart_matches = re.findall(chart_pattern, reply)
    
    if chart_matches and request.session_file_path and os.path.exists(request.session_file_path):
        try:
            df = pd.read_csv(request.session_file_path)
            target_col = state.data_info.get("target_candidate") if state and state.data_info else None
            
            for chart_type in chart_matches:
                print(f"DEBUG: Generating chart: {chart_type}")
                chart_path = generate_chart(chart_type, df, request.session_id, target_col)
                if chart_path:
                    images.append(chart_path)
                    print(f"DEBUG: Chart saved at {chart_path}")
        except Exception as chart_err:
            print(f"CHART ERROR: {str(chart_err)}")
    
    # Clean [CHART: ...] tags from the reply text
    clean_reply = re.sub(chart_pattern, '', reply).strip()

    # Save AI reply
    save_message(request.session_id, "assistant", clean_reply)
    
    return ChatResponse(
        reply=clean_reply, 
        updated_pipeline_step=state.step if state else "eda",
        images=images
    )

@router.get("/history/{session_id}")
async def get_chat_history(session_id: str):
    return get_history(session_id)