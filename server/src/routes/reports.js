import { Router } from "express";
import { spawn } from "child_process";
import path from "path";

const router = Router();
const REPORTS = [];

// Run Python ML pipeline (predict.py in /ml)
async function runPredict(payload) {
  const script = path.resolve(process.cwd(), "ml", "predict.py");
  return await new Promise((resolve) => {
    const py = spawn(process.env.PYTHON_PATH || "python", [script], {
      cwd: path.resolve(process.cwd()),
      env: process.env
    });
    let out = "", err = "";
    py.stdout.on("data", d => out += d.toString());
    py.stderr.on("data", d => err += d.toString());
    py.on("close", () => {
      try { resolve(JSON.parse(out || "{}")); }
      catch { resolve({ error: "bad_python_output", raw: out, stderr: err }); }
    });
    py.stdin.write(JSON.stringify(payload));
    py.stdin.end();
  });
}

// ---------- Endpoints ----------

// Health
router.get("/", (req, res) => {
  res.json({ ok: true, message: "Coastal Risk Express API running." });
});

// Predict only
router.post("/predict", async (req, res) => {
  const features = req.body;
  if (!features) return res.status(400).json({ message: "Missing features" });
  const pred = await runPredict(features);
  res.json(pred);
});

// All reports
router.get("/reports", (req, res) => {
  res.json(REPORTS);
});

// Save report
router.post("/reports", (req, res) => {
  const { features, predicted_risk_level, risk_score, report_text } = req.body || {};
  if (!features || !predicted_risk_level) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  const id = "r_" + String(REPORTS.length + 1).padStart(5, "0");
  const created_at = new Date().toISOString();
  const item = {
    id,
    created_at,
    features,
    predicted_risk_level,
    risk_score: Number(risk_score),
    report_text: report_text || ""
  };
  REPORTS.push(item);
  res.json(item);
});

// AI report (Gemini optional)
router.post("/ai-report", async (req, res) => {
  const { features, predicted_risk_level, risk_score } = req.body || {};
  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ message: "GEMINI_API_KEY not set" });
  }

  try {
    const { GoogleGenerativeAI } = await import("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL_ID || "gemini-1.5-flash"
    });

    const prompt = `
You are a coastal resilience expert. Return ONLY valid JSON:
{
  "title": "string",
  "summary": "string",
  "risk_assessment": {
    "risk_level": "Safe | Caution | Dangerous",
    "risk_score": "number",
    "drivers": ["string"]
  },
  "recommended_remedies": [
    {"priority":"High|Medium|Low","action":"string","owner":"string","timeframe":"Immediate|24h|72h","why_it_helps_blue_carbon":"string"}
  ],
  "monitoring_next_72h": ["string"],
  "notes": "string"
}

Inputs:
${JSON.stringify(features, null, 2)}
Prediction:
- risk_level: ${predicted_risk_level}
- risk_score: ${risk_score}
`;
    const result = await model.generateContent(prompt, {
      generationConfig: { responseMimeType: "application/json" }
    });

    const text = result.response.text();
    const reportObj = JSON.parse(text);
    res.json({ ok: true, ai_report: reportObj });
  } catch (e) {
    res.status(500).json({ message: "Gemini error", error: e.message });
  }
});

export default router;
