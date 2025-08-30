import { useState } from "react";
import api from "../utils/api.js";
import { useAuth } from "../state/AuthContext.jsx";

export default function ReportIncident() {
  const { user } = useAuth(); // not used for auth now, but kept if you show name later
  const [form, setForm] = useState({
    tide_height: "", wind_speed: "", sea_temp: "",
    rainfall: "", mangrove_index: "",
    past_event: "", region_name: "", tide_zone: ""
  });
  const [status, setStatus] = useState(null); 
  // status = { ok, pred: {predicted_risk_level, risk_score}, ai: {...}, message? }

  const setField = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setStatus(null);
    try {
      // 1) Predict with ML
      const predRes = await api.post("/predict", form);
      const pred = predRes.data; // { predicted_risk_level, risk_score }

      // 2) Ask Gemini to format a report with remedies
      const aiRes = await api.post("/ai-report", {
        features: form,
        predicted_risk_level: pred.predicted_risk_level,
        risk_score: pred.risk_score ?? 0
      });

      setStatus({ ok: true, pred, ai: aiRes.data.ai_report });
    } catch (e) {
      setStatus({ ok: false, message: e.message });
      alert("Error: " + e.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-extrabold mb-2">Report Incident</h2>
      <p className="text-sm text-slate-400 mb-6">
        Fill the attributes. We'll generate a model-backed report with remedies to protect blue carbon.
      </p>

      {status?.ok === false && (
        <div className="mb-3 text-red-400">{status.message}</div>
      )}

      <form
        onSubmit={submit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-900/60 p-4 rounded-xl border border-white/10"
      >
        <div>
          <label className="text-sm text-slate-300">Tide height</label>
          <input required type="number" step="any"
            value={form.tide_height} onChange={e=>setField("tide_height", e.target.value)}
            className="w-full mt-1 bg-slate-900 border border-white/10 rounded-xl px-3 py-2"/>
        </div>
        <div>
          <label className="text-sm text-slate-300">Wind speed</label>
          <input required type="number" step="any"
            value={form.wind_speed} onChange={e=>setField("wind_speed", e.target.value)}
            className="w-full mt-1 bg-slate-900 border border-white/10 rounded-xl px-3 py-2"/>
        </div>
        <div>
          <label className="text-sm text-slate-300">Sea surface temperature</label>
          <input required type="number" step="any"
            value={form.sea_temp} onChange={e=>setField("sea_temp", e.target.value)}
            className="w-full mt-1 bg-slate-900 border border-white/10 rounded-xl px-3 py-2"/>
        </div>
        <div>
          <label className="text-sm text-slate-300">Rainfall</label>
          <input required type="number" step="any"
            value={form.rainfall} onChange={e=>setField("rainfall", e.target.value)}
            className="w-full mt-1 bg-slate-900 border border-white/10 rounded-xl px-3 py-2"/>
        </div>
        <div>
          <label className="text-sm text-slate-300">Mangrove index</label>
          <input required type="number" step="any"
            value={form.mangrove_index} onChange={e=>setField("mangrove_index", e.target.value)}
            className="w-full mt-1 bg-slate-900 border border-white/10 rounded-xl px-3 py-2"/>
        </div>
        <div>
          <label className="text-sm text-slate-300">Past event</label>
          <input type="text"
            value={form.past_event} onChange={e=>setField("past_event", e.target.value)}
            className="w-full mt-1 bg-slate-900 border border-white/10 rounded-xl px-3 py-2"/>
        </div>
        <div>
          <label className="text-sm text-slate-300">Region name</label>
          <input type="text"
            value={form.region_name} onChange={e=>setField("region_name", e.target.value)}
            className="w-full mt-1 bg-slate-900 border border-white/10 rounded-xl px-3 py-2"/>
        </div>
        <div className="md:col-span-2">
          <label className="text-sm text-slate-300">Tide zone</label>
          <input type="text"
            value={form.tide_zone} onChange={e=>setField("tide_zone", e.target.value)}
            className="w-full mt-1 bg-slate-900 border border-white/10 rounded-xl px-3 py-2"/>
        </div>
        <div className="md:col-span-2">
          <button className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500">
            Submit
          </button>
        </div>
      </form>

      {/* Render ML + AI report */}
      {status?.ok && (
        <div className="mt-6 p-4 rounded-xl border border-white/10 bg-slate-900/60">
          <h3 className="font-bold text-xl mb-2">{status.ai?.title || "Model Report"}</h3>

          {/* Top line: risk + score */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
            <div className="p-3 rounded-lg bg-slate-800/60 border border-white/10">
              <div className="text-xs text-slate-400">Risk Level</div>
              <div className="text-lg font-semibold">
                {status.ai?.risk_assessment?.risk_level || status.pred?.predicted_risk_level || status.pred?.predicted_risk_level}
                {!status.ai?.risk_assessment?.risk_level && status.pred?.predicted_risk_level}
              </div>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/60 border border-white/10">
              <div className="text-xs text-slate-400">Risk Score (Dangerous prob)</div>
              <div className="text-lg font-semibold">
                {(status.ai?.risk_assessment?.risk_score ?? status.pred?.risk_score ?? 0).toFixed(3)}
              </div>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/60 border border-white/10">
              <div className="text-xs text-slate-400">Drivers</div>
              <div className="text-sm">
                {(status.ai?.risk_assessment?.drivers || []).join(", ")}
              </div>
            </div>
          </div>

          {status.ai?.summary && (
            <>
              <h4 className="font-semibold mb-1">Summary</h4>
              <div className="text-slate-300 text-sm whitespace-pre-wrap mb-3">
                {status.ai.summary}
              </div>
            </>
          )}

          <h4 className="font-semibold mb-2">Recommended Remedies (protect blue carbon)</h4>
          <ul className="text-slate-300 text-sm space-y-2 mb-4">
            {(status.ai?.recommended_remedies || []).map((r, i) => (
              <li key={i} className="p-3 rounded-lg bg-slate-800/60 border border-white/10">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{r.action}</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-700/60 border border-white/10">{r.priority}</span>
                </div>
                <div className="text-xs text-slate-400 mt-1">Owner: {r.owner} • Timeframe: {r.timeframe}</div>
                <div className="text-xs mt-1">Why it helps: {r.why_it_helps_blue_carbon}</div>
              </li>
            ))}
          </ul>

          <h4 className="font-semibold mb-2">Monitoring (next 72h)</h4>
          <ul className="list-disc pl-6 text-slate-300 text-sm space-y-1 mb-3">
            {(status.ai?.monitoring_next_72h || []).map((m, i) => <li key={i}>{m}</li>)}
          </ul>

          {status.ai?.notes && (
            <>
              <h4 className="font-semibold mb-2">Notes</h4>
              <div className="text-slate-300 text-sm whitespace-pre-wrap">{status.ai.notes}</div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
