import pandas as pd
import numpy as np
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
import joblib
import os

def build_preprocessing_pipeline(session_id: str, data_info: dict, strategy: str = "auto") -> str:
    """Create and save a sklearn preprocessing pipeline"""
    # In a real implementation, you'd load the actual dataframe from session_id
    # For demo, we assume the CSV is at uploads/{session_id}_*
    file_path = None
    for f in os.listdir("uploads"):
        if f.startswith(session_id) and f.endswith(".csv"):
            file_path = os.path.join("uploads", f)
            break
    if not file_path:
        raise ValueError("CSV file not found for session")
    
    df = pd.read_csv(file_path)
    numeric_cols = data_info.get("numeric_features", [])
    categorical_cols = data_info.get("categorical_features", [])
    
    # Build transformers
    numeric_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='median')),
        ('scaler', StandardScaler())
    ])
    categorical_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='constant', fill_value='missing')),
        ('onehot', OneHotEncoder(handle_unknown='ignore'))
    ])
    
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', numeric_transformer, numeric_cols),
            ('cat', categorical_transformer, categorical_cols)
        ])
    
    # Save pipeline
    pipeline_path = os.path.join("uploads", f"{session_id}_preprocessor.pkl")
    joblib.dump(preprocessor, pipeline_path)
    return pipeline_path