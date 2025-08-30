import { Router } from "express";
import { spawn } from "child_process";
import path from "path";
import { db } from "../data/db.js";
import { requireAuth } from "../middleware/auth.js";
import { nanoid } from "nanoid";

const router = Router();

router.get("/", requireAuth, (req, res) => {
  const items = db.incidents.filter(i => i.userId === req.user.id);
  res.json(items);
});

router.post("/", requireAuth, (req, res) => {
  const { type, description, location, lat, lng, photo } = req.body;
  if (!type || !description) return res.status(400).json({ message: "Type and description are required" });
  const inc = {
    id: nanoid(),
    userId: req.user.id,
    type,
    description,
    location: location || "",
    lat: lat || "",
    lng: lng || "",
    photo: photo || null,
    timestamp: Date.now()
  };
  db.incidents.push(inc);
  res.json(inc);
});

export default router;


async function runPredict(payload) {
  const script = path.resolve(process.cwd(), "ml", "predict.py");
  return await new Promise((resolve) => {
    const py = spawn(process.env.PYTHON_PATH || "python", [script], {
      cwd: path.resolve(process.cwd()), env: process.env
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


// Rich incident with model report
router.post("/report", requireAuth, async (req, res) => {
  const {
    tide_height, wind_speed, sea_temp, rainfall, mangrove_index,
    past_event, region_name, time_stamp, tide_zone
  } = req.body || {};

  // basic validation
  if ([tide_height, wind_speed, sea_temp, rainfall, mangrove_index].some(v => v === undefined)) {
    return res.status(400).json({ message: "Missing required numeric fields" });
  }

  const features = { tide_height, wind_speed, sea_temp, rainfall, mangrove_index, past_event, region_name, time_stamp, tide_zone };
  const pred = await runPredict(features);

  const inc = {
    id: String(Date.now()) + Math.random().toString(36).slice(2,7),
    userId: req.user.id,
    kind: "modelled",
    features,
    prediction: pred,
    region_name: region_name || "",
    time_stamp: time_stamp || Date.now(),
    tide_zone: tide_zone || "",
    timestamp: Date.now()
  };
  db.incidents.push(inc);
  res.json(inc);
});

// Get current user's incidents
router.get("/my", requireAuth, (req, res) => {
  const rows = db.incidents.filter(i => i.userId === req.user.id).sort((a,b)=>b.timestamp-a.timestamp);
  res.json(rows);
});

// User analytics
router.get("/analytics/my", requireAuth, (req, res) => {
  const rows = db.incidents.filter(i => i.userId === req.user.id);
  const total = rows.length;
  const avgRisk = total ? rows.reduce((s, r) => s + (r?.prediction?.risk_score || 0), 0) / total : 0;
  const byRegionMap = {};
  rows.forEach(r => {
    const rg = r.features?.region_name || r.region_name || "Unknown";
    byRegionMap[rg] = (byRegionMap[rg] || 0) + 1;
  });
  const byRegion = Object.entries(byRegionMap).map(([region, count]) => ({ region, count }));

  const series = rows
    .map(r => ({
      t: r.features?.time_stamp || r.time_stamp || r.timestamp,
      risk: r?.prediction?.risk_score || 0
    }))
    .sort((a,b) => (new Date(a.t)).getTime() - (new Date(b.t)).getTime());

  res.json({ total, avgRisk, byRegion, series });
});
