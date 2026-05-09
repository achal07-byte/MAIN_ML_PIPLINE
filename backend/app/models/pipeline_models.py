from pydantic import BaseModel
from typing import Optional, Dict, Any

class PipelineState(BaseModel):
    session_id: str
    step: str  # data_upload, eda, preprocessing, model_selection, training, evaluation, export_code
    data_info: Optional[Dict[str, Any]] = None
    preprocessor_path: Optional[str] = None
    model_path: Optional[str] = None
    evaluation_metrics: Optional[Dict[str, Any]] = None