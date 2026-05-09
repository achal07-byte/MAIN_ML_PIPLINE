from fastapi import APIRouter, HTTPException, BackgroundTasks
from app.services.pipeline_state import get_pipeline_state, update_pipeline_state
from app.services.preprocessor import build_preprocessing_pipeline
from app.services.model_selector import train_and_select_model
from app.services.code_generator import export_pipeline_code
import os

router = APIRouter()

from app.services.database import get_all_sessions

@router.get("/sessions")
async def list_sessions():
    return get_all_sessions()

@router.get("/status/{session_id}")
async def get_status(session_id: str):
    state = get_pipeline_state(session_id)
    if not state:
        raise HTTPException(404, "Session not found")
    return {"step": state.step, "data_info": state.data_info, "metrics": state.evaluation_metrics}

@router.post("/preprocess/{session_id}")
async def preprocess_data(session_id: str, strategy: str = "auto"):
    state = get_pipeline_state(session_id)
    if not state or not state.data_info:
        raise HTTPException(400, "No data found – upload first")
    
    # Build pipeline and save it
    pipeline_path = build_preprocessing_pipeline(session_id, state.data_info, strategy)
    update_pipeline_state(session_id, "preprocessing", preprocessor_path=pipeline_path)
    return {"status": "preprocessing completed", "pipeline_path": pipeline_path}

@router.post("/train/{session_id}")
async def train_model(session_id: str, target_column: str = None, problem_type: str = None):
    state = get_pipeline_state(session_id)
    if not state or not state.preprocessor_path:
        raise HTTPException(400, "Preprocessing not done yet")
    
    model_path, metrics = train_and_select_model(session_id, state.preprocessor_path, target_column, problem_type)
    update_pipeline_state(session_id, "training", model_path=model_path, evaluation_metrics=metrics)
    return {"status": "training completed", "metrics": metrics}

@router.get("/export/{session_id}")
async def export_code(session_id: str):
    state = get_pipeline_state(session_id)
    if not state:
        raise HTTPException(404, "Session not found")
    
    code = export_pipeline_code(state)
    file_path = os.path.join("exports", f"{session_id}_pipeline.py")
    with open(file_path, "w") as f:
        f.write(code)
    return {"code": code, "download_url": f"/exports/{session_id}_pipeline.py"}