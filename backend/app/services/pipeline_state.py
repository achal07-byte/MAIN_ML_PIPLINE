from app.models.chat_models import PipelineState
from typing import Dict, Optional

# In-memory store for demo (replace with Redis/DB in production)
_state_store: Dict[str, PipelineState] = {}

def get_pipeline_state(session_id: str) -> Optional[PipelineState]:
    return _state_store.get(session_id)

def update_pipeline_state(
    session_id: str,
    step: str,
    data_info: dict = None,
    preprocessor_path: str = None,
    model_path: str = None,
    evaluation_metrics: dict = None
) -> PipelineState:
    state = _state_store.get(session_id)
    if not state:
        state = PipelineState(session_id=session_id, step=step)
    if step:
        state.step = step
    if data_info:
        state.data_info = data_info
    if preprocessor_path:
        state.preprocessor_path = preprocessor_path
    if model_path:
        state.model_path = model_path
    if evaluation_metrics:
        state.evaluation_metrics = evaluation_metrics
    _state_store[session_id] = state
    return state