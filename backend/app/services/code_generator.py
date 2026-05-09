def export_pipeline_code(state) -> str:
    """Generate a standalone Python script based on pipeline decisions"""
    target = state.data_info.get("target_candidate", "target_column")
    problem_type = state.data_info.get("problem_type", "classification")
    numeric_cols = ", ".join([f"'{c}'" for c in state.data_info.get("numeric_features", [])[:5]])
    categorical_cols = ", ".join([f"'{c}'" for c in state.data_info.get("categorical_features", [])[:5]])
    
    code = f'''# Auto-generated ML Pipeline
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.metrics import accuracy_score, classification_report, mean_squared_error, r2_score

# Load data
df = pd.read_csv("your_dataset.csv")

# Define features and target
target = "{target}"
X = df.drop(columns=[target])
y = df[target]

# Preprocessing
numeric_features = [{numeric_cols}]
categorical_features = [{categorical_cols}]

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
        ('num', numeric_transformer, numeric_features),
        ('cat', categorical_transformer, categorical_features)
    ])

# Model selection
if "{problem_type}" == "classification":
    model = RandomForestClassifier(n_estimators=100, random_state=42)
else:
    model = RandomForestRegressor(n_estimators=100, random_state=42)

# Create full pipeline
full_pipeline = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('model', model)
])

# Train/Test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train
full_pipeline.fit(X_train, y_train)

# Evaluate
y_pred = full_pipeline.predict(X_test)
if "{problem_type}" == "classification":
    print("Accuracy:", accuracy_score(y_test, y_pred))
    print("Classification Report:\\n", classification_report(y_test, y_pred))
else:
    print("RMSE:", mean_squared_error(y_test, y_pred, squared=False))
    print("R²:", r2_score(y_test, y_pred))

# Save model
import joblib
joblib.dump(full_pipeline, "automl_pipeline.pkl")
print("Pipeline saved as automl_pipeline.pkl")
'''
    return code