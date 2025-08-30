import os, json
from datetime import datetime
from typing import List, Optional, Dict, Any

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import pandas as pd
import joblib

# —— Optional Gemini (Google AI Studio) ——
GEMINI_MODEL_ID = os.environ.get("GEMINI_MODEL_ID", "gemini-1.5-flash")
GEMINI_KEY = os.environ.get("GEMINI_API_KEY")

model = None
label_encoder = None
predict_proba_supported = True

# In-memory store (swap to Mongo later if you want)
REPORTS: List[dict] = []

# ---------- Pydantic Models ----------
class RiskInput(BaseModel):
    tide_height: float
    wind_speed: float
    sea_temp: float
    rainfall: float
    mangrove_index: float
    past_event: Optional[str] = ""
    region_name: Optional[str] = ""
    tide_zone: Optional[str] = ""

class CreateReportBody(BaseModel):
    features: RiskInput
    predicted_risk_level: str
    risk_score: float
    report_text: str  # can be AI JSON or pretty text

class AIRemedyBody(BaseModel):
    features: Dict[str, Any]
    predicted_risk_level: str
    risk_score: float

# ---------- App ----------
app = FastAPI(title="Coastal Risk Prediction API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_credentials=True,
    allow_methods=["*"], allow_headers=["*"],
)

# ---------- Load ML Artifacts ----------
@app.on_event("startup")
def _load_artifacts():
    global model, label_encoder, predict_proba_supported
    # Path envs let you mount any storage location
    model_path = os.environ.get("RISK_MODEL_PATH", "risk_model_randomforest.pkl")
    le_path = os.environ.get("RISK_LABEL_PATH", "risk_label_encoder.pkl")

    if not os.path.exists(model_path) or not os.path.exists(le_path):
        raise RuntimeError(
            f"Model or label encoder not found. "
            f"Expected {model_path} and {le_path} in working dir."
        )

    model = joblib.load(model_path)
    label_encoder = joblib.load(le_path)
    predict_proba_supported = hasattr(model, "predict_proba")

# ---------- Endpoints ----------
@app.get("/")
def home():
    return {"ok": True, "message": "Coastal Risk API is running."}

@app.post("/predict")
def predict_risk(data: RiskInput):
    df = pd.DataFrame([data.dict()])
    pred_encoded = model.predict(df)
    pred_label = label_encoder.inverse_transform(pred_encoded)[0]

    if predict_proba_supported:
        proba = model.predict_proba(df)[0]
        classes = list(label_encoder.classes_)
        if "Dangerous" in classes:
            risk_score = float(proba[classes.index("Dangerous")])
        else:
            risk_score = float(max(proba))
    else:
        risk_score = 1.0 if pred_label == "Dangerous" else 0.0

    return {"predicted_risk_level": pred_label, "risk_score": risk_score}

@app.get("/reports")
def list_reports():
    return REPORTS

@app.post("/reports")
def create_report(body: CreateReportBody):
    rid = f"r_{len(REPORTS)+1:05d}"
    created = datetime.utcnow().isoformat() + "Z"
    item = {
        "id": rid,
        "created_at": created,
        "features": body.features.dict(),
        "predicted_risk_level": body.predicted_risk_level,
        "risk_score": float(body.risk_score),
        "report_text": body.report_text
    }
    REPORTS.append(item)
    return item

# ---------- Gemini Report ----------
@app.post("/ai-report")
def ai_report(body: AIRemedyBody):
    if not GEMINI_KEY:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY not set on server.")

    try:
        import google.generativeai as genai
        genai.configure(api_key=GEMINI_KEY)
        gmodel = genai.GenerativeModel(GEMINI_MODEL_ID)

        prompt = f"""
You are a coastal resilience expert. Create a concise, structured report to brief
disaster management teams. Use the inputs and predicted risk to:
1) Summarize the situation and likely causes.
2) Assess immediate risk to life & ecosystems, esp. blue carbon (mangroves, seagrass).
3) Recommend concrete, prioritized remedies (operational & community actions) to protect blue carbon.
4) Suggest monitoring & data needs for the next 24–72 hours.

Return ONLY valid JSON with the following shape:
{{
  "title": "string",
  "summary": "string",
  "risk_assessment": {{
    "risk_level": "Safe | Caution | Dangerous",
    "risk_score": "number (0-1)",
    "drivers": ["string"]
  }},
  "recommended_remedies": [
    {{
      "priority": "High | Medium | Low",
      "action": "string",
      "owner": "Agency/Role",
      "timeframe": "Immediate | 24h | 72h",
      "why_it_helps_blue_carbon": "string"
    }}
  ],
  "monitoring_next_72h": ["string"],
  "notes": "string"
}}

Inputs:
{json.dumps(body.features, indent=2)}
Prediction:
- risk_level: {body.predicted_risk_level}
- risk_score: {body.risk_score}
"""
        resp = gmodel.generate_content(
            prompt, generation_config={"response_mime_type": "application/json"}
        )

        text = getattr(resp, "text", None)
        if not text and resp and resp.candidates and resp.candidates[0].content.parts:
            text = resp.candidates[0].content.parts[0].text
        if not text:
            raise HTTPException(status_code=500, detail="Empty response from Gemini")

        report_obj = json.loads(text)  # validate JSON
        return {"ok": True, "ai_report": report_obj}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gemini error: {e}")
