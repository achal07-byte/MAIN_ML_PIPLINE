import pandas as pd
import joblib
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.linear_model import LogisticRegression, LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, f1_score, mean_squared_error
import os

def train_and_select_model(session_id: str, preprocessor_path: str, target_column: str = None, problem_type: str = None) -> tuple:
    """Train a default model and return (model_path, metrics)"""
    # Load data
    csv_path = None
    for f in os.listdir("uploads"):
        if f.startswith(session_id) and f.endswith(".csv"):
            csv_path = os.path.join("uploads", f)
            break
    df = pd.read_csv(csv_path)
    
    # Determine target
    if not target_column:
        # Simple heuristic: if 'survived' exists, use it
        if 'survived' in df.columns:
            target_column = 'survived'
        else:
            # use first numeric column that is not an index
            for col in df.columns:
                if df[col].dtype in ['int64', 'float64'] and col.lower() not in ['id', 'index']:
                    target_column = col
                    break
    X = df.drop(columns=[target_column])
    y = df[target_column]
    
    # Preprocess
    preprocessor = joblib.load(preprocessor_path)
    X_processed = preprocessor.fit_transform(X)
    
    # Train/test split
    X_train, X_test, y_train, y_test = train_test_split(X_processed, y, test_size=0.2, random_state=42)
    
    # Choose model based on problem_type or detect
    if problem_type == "classification" or y.nunique() <= 10:
        model = RandomForestClassifier(n_estimators=100, random_state=42)
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)
        metrics = {
            "accuracy": accuracy_score(y_test, y_pred),
            "f1_score": f1_score(y_test, y_pred, average='weighted')
        }
    else:
        model = RandomForestRegressor(n_estimators=100, random_state=42)
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)
        metrics = {
            "rmse": mean_squared_error(y_test, y_pred, squared=False),
            "r2": model.score(X_test, y_test)
        }
    
    # Save model
    model_path = os.path.join("uploads", f"{session_id}_model.pkl")
    joblib.dump(model, model_path)
    return model_path, metrics