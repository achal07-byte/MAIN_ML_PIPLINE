import os
import httpx
from dotenv import load_dotenv
from typing import List, Tuple
import json
import time

load_dotenv()
api_key = os.getenv("CHAT_API_KEY")

OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"

def get_claude_response(
    user_message: str,
    system_prompt: str,
    conversation_history: List,
    current_step: str
) -> Tuple[str, str]:
    """
    Returns (reply_text, suggested_next_step) using OpenRouter
    """
    messages = []
    # OpenRouter handles system prompts as a role
    messages.append({"role": "system", "content": system_prompt + """
    At the end of your response, if you think the pipeline should advance to a specific step, write:
    [NEXT_STEP: step_name]
    where step_name can be: 'eda', 'preprocessing', 'model_selection', 'training', 'evaluation', 'export_code'.
    If no advancement, write [NEXT_STEP: none].
    """})
    
    for msg in conversation_history:
        # Handle both Pydantic models (from request) and dicts (from DB)
        if hasattr(msg, "role"):
            role = msg.role
            content = msg.content
        else:
            role = msg.get("role", "user")
            content = msg.get("content", "")
        messages.append({"role": role, "content": content})
    
    messages.append({"role": "user", "content": user_message})
    
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:5173", # Optional
        "X-Title": "AutoML Pipeline Assistant", # Optional
    }
    
    payload = {
        "model": "meta-llama/llama-3.1-8b-instruct",
        "messages": messages,
        "temperature": 0.7,
        "max_tokens": 1024
    }
    
    print(f"DEBUG: Sending request to OpenRouter with model {payload['model']}")
    
    max_retries = 3
    retry_delay = 2 # seconds
    
    for attempt in range(max_retries):
        try:
            with httpx.Client() as client:
                response = client.post(OPENROUTER_URL, headers=headers, json=payload, timeout=60.0)
                print(f"DEBUG: OpenRouter status code: {response.status_code} (Attempt {attempt + 1})")
                
                if response.status_code == 429:
                    if attempt < max_retries - 1:
                        print(f"DEBUG: Rate limited. Retrying in {retry_delay}s...")
                        time.sleep(retry_delay)
                        retry_delay *= 2 # Exponential backoff
                        continue
                
                if response.status_code != 200:
                    print(f"OPENROUTER ERROR RESPONSE: {response.text}")
                    response.raise_for_status()
                    
                data = response.json()
                
                if "choices" not in data:
                    print(f"OPENROUTER INVALID DATA: {json.dumps(data)}")
                    raise Exception("Invalid response format from OpenRouter")
                    
                reply = data["choices"][0]["message"]["content"]
                print("DEBUG: Successfully received reply from OpenRouter")
                break # Success!
        except Exception as e:
            if attempt == max_retries - 1:
                print(f"AI INVOCATION ERROR DETAILS: {type(e).__name__}: {str(e)}")
                raise e
            print(f"DEBUG: Attempt {attempt + 1} failed, retrying...")
            time.sleep(1)
    
    # Parse suggested step
    suggested = "none"
    if "[NEXT_STEP:" in reply:
        try:
            start = reply.find("[NEXT_STEP:") + 11
            end = reply.find("]", start)
            if end != -1:
                suggested = reply[start:end].strip()
                # Clean the reply by removing the tag
                reply = reply.replace(reply[start-11:end+1], "").strip()
        except Exception as parse_err:
            print(f"DEBUG: Failed to parse suggested step: {str(parse_err)}")
            pass
    return reply, suggested if suggested != "none" else None