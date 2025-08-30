# =========================
# FastAPI: Coastal Risk Prediction API
# =========================

from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import pandas as pd

# =========================
# 1. Load Model & Label Encoder
# =========================
model = joblib.load("risk_model_randomforest.pkl")
label_encoder = joblib.load("risk_label_encoder.pkl")

# =========================
# 2. Define Request Schema
# =========================
class RiskInput(BaseModel):
    tide_height: float
    wind_speed: float
    sea_temp: float
    rainfall: float
    mangrove_index: float
    past_event: str
    region_name: str
    tide_zone: str

# =========================
# 3. Create FastAPI App
# =========================
app = FastAPI(
    title="Coastal Risk Prediction API",
    description="Predicts coastal risk level (Safe / Caution / Dangerous) using environmental features",
    version="1.0"
)

# =========================
# 4. API Routes
# =========================
@app.get("/")
def home():
    return {"message": "Welcome to Coastal Risk Prediction API"}

@app.post("/predict")
def predict_risk(data: RiskInput):
    # Convert input to DataFrame
    df = pd.DataFrame([data.dict()])

    # Make prediction
    pred_encoded = model.predict(df)
    pred_label = label_encoder.inverse_transform(pred_encoded)

    return {
        "input": data.dict(),
        "predicted_risk_level": pred_label[0]
    }

# =========================
# Run with: uvicorn filename:app --reload
# =========================
