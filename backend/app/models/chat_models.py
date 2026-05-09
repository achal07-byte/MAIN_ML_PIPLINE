from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str

class ChatRequest(BaseModel):
    message: str
    session_id: str
    session_file_path: Optional[str] = None
    pipeline_step: Optional[str] = None
    history: List[ChatMessage] = []

class ChatResponse(BaseModel):
    reply: str
    suggested_next_step: Optional[str] = None
    updated_pipeline_step: Optional[str] = None
    images: List[str] = []  # List of image URL paths (e.g., "uploads/chart.png")

class PipelineState(BaseModel):
    session_id: str
    step: str  # data_upload, eda, preprocessing, model_selection, training, evaluation, export_code
    data_info: Optional[Dict[str, Any]] = None
    preprocessor_path: Optional[str] = None
    model_path: Optional[str] = None
    evaluation_metrics: Optional[Dict[str, Any]] = None