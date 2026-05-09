import pandas as pd
import numpy as np
from ydata_profiling import ProfileReport
import json
import os

def run_eda(df: pd.DataFrame, session_id: str) -> dict:
    """Run full EDA and return structured info + profile report path"""
    # Basic stats
    rows, cols = df.shape
    missing = df.isnull().sum().sum()
    numeric_cols = df.select_dtypes(include=np.number).columns.tolist()
    categorical_cols = df.select_dtypes(include='object').columns.tolist()
    
    # Detect target candidate
    target_candidate = None
    if 'survived' in df.columns:
        target_candidate = 'survived'
    elif 'price' in df.columns or 'cost' in df.columns:
        for col in ['price', 'cost']:
            if col in df.columns:
                target_candidate = col
                break
    else:
        # first numeric non-id column
        for col in numeric_cols:
            if col.lower() not in ['id', 'index', 'row_id']:
                target_candidate = col
                break
    
    # Problem type guess
    problem_type = None
    if target_candidate:
        unique_vals = df[target_candidate].nunique()
        if unique_vals <= 10:
            problem_type = "classification"
        else:
            problem_type = "regression"
    
    # Create profile report (HTML) – store in uploads folder
    profile = ProfileReport(df, title=f"EDA Report {session_id}", minimal=True)
    report_path = os.path.join("uploads", f"{session_id}_profile.html")
    profile.to_file(report_path)
    
    # Convert any numpy types to standard python types for JSON serialization
    result = {
        "rows": int(rows),
        "cols": int(cols),
        "missing_count": int(missing),
        "numeric_features": [str(c) for c in numeric_cols[:10]],
        "categorical_features": [str(c) for c in categorical_cols[:10]],
        "target_candidate": str(target_candidate) if target_candidate else None,
        "problem_type": str(problem_type) if problem_type else None,
        "profile_report_path": str(report_path).replace("\\", "/"),
        "column_names": [str(c) for c in df.columns.tolist()]
    }
    return result

def get_eda_summary(eda_dict: dict) -> str:
    """Return a human-readable summary for Claude"""
    return f"""
Dataset shape: {eda_dict['rows']} rows, {eda_dict['cols']} columns.
Missing values: {eda_dict['missing_count']}.
Numeric features: {', '.join(eda_dict.get('numeric_features', [])[:5])}
Categorical features: {', '.join(eda_dict.get('categorical_features', [])[:5])}
Suggested target column: {eda_dict.get('target_candidate', 'unknown')}
Likely problem type: {eda_dict.get('problem_type', 'unknown')}
"""