from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import traceback, os, joblib
from typing import List, Optional

MODEL_PATH = os.path.join(os.path.dirname(__file__), "models", "random_forest_model.pkl")

app = FastAPI(title="Nereus ML Inference", version="0.1")

class PredictRequest(BaseModel):
    features: List[float]
    meta: Optional[dict] = None

class PredictResponse(BaseModel):
    prediction: int
    probability: float
    details: Optional[dict] = None

# load model at startup
model = None
try:
    model = joblib.load(MODEL_PATH)
except Exception as e:
    model = None
    print("Could not load model:", e)

@app.get("/health")
def health():
    return {"status":"ok", "model_loaded": model is not None}

@app.post("/predict", response_model=PredictResponse)
def predict(req: PredictRequest):
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded on server.")
    try:
        X = [req.features]
        pred = model.predict(X)[0]
        # try probability if available
        prob = None
        if hasattr(model, "predict_proba"):
            prob = float(max(model.predict_proba(X)[0]))
        else:
            prob = 1.0
        return PredictResponse(prediction=int(pred), probability=prob, details={"feature_length": len(req.features)})
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/retrain")
def retrain():
    return {"status":"retrain_started", "note":"This is a stub. Implement retraining job orchestration."}
