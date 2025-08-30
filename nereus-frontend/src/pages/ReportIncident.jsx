import { useState } from "react";
import api from "../utils/api.js";

export default function ReportIncident() {
  const [form, setForm] = useState({
    type: "Pollution",
    description: "",
    location: "",
    lat: "",
    lng: "",
    photo: null,
  });
  const [status, setStatus] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setStatus(null);
    try {
      const payload = { ...form };
      if (payload.photo) {
        const b64 = await fileToBase64(payload.photo);
        payload.photo = b64;
      }
      const { data } = await api.post("/incidents", payload);
      setStatus({ ok: true, msg: "Incident reported successfully", data });
      setForm({ type: "Pollution", description: "", location: "", lat: "", lng: "", photo: null });
    } catch (err) {
      setStatus({ ok: false, msg: err.message || "Failed to submit" });
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h2 className="text-2xl font-bold mb-4">Report Incident</h2>
      <form onSubmit={submit} className="space-y-4 glass p-6 rounded-2xl border border-white/10">
        {status && <div className={status.ok ? "text-green-400" : "text-red-400"}>{status.msg}</div>}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-slate-300">Type</label>
            <select value={form.type} onChange={e=>setForm(f=>({...f, type: e.target.value}))} className="w-full mt-1 bg-slate-900 border border-white/10 rounded-xl px-3 py-2">
              <option>Pollution</option>
              <option>Illegal Fishing</option>
              <option>Coastal Erosion</option>
              <option>Storm Surge</option>
              <option>Algal Bloom</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-slate-300">Location (name)</label>
            <input value={form.location} onChange={e=>setForm(f=>({...f, location: e.target.value}))} className="w-full mt-1 bg-slate-900 border border-white/10 rounded-xl px-3 py-2" placeholder="e.g., Juhu Beach, Mumbai" />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-slate-300">Latitude</label>
            <input value={form.lat} onChange={e=>setForm(f=>({...f, lat: e.target.value}))} className="w-full mt-1 bg-slate-900 border border-white/10 rounded-xl px-3 py-2" />
          </div>
          <div>
            <label className="text-sm text-slate-300">Longitude</label>
            <input value={form.lng} onChange={e=>setForm(f=>({...f, lng: e.target.value}))} className="w-full mt-1 bg-slate-900 border border-white/10 rounded-xl px-3 py-2" />
          </div>
        </div>
        <div>
          <label className="text-sm text-slate-300">Description</label>
          <textarea value={form.description} onChange={e=>setForm(f=>({...f, description: e.target.value}))} rows="4" className="w-full mt-1 bg-slate-900 border border-white/10 rounded-xl px-3 py-2" />
        </div>
        <div>
          <label className="text-sm text-slate-300">Photo (optional)</label>
          <input type="file" accept="image/*" onChange={e=>setForm(f=>({...f, photo: e.target.files?.[0] || null}))} className="w-full mt-1" />
        </div>
        <button className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500">Submit Report</button>
      </form>
    </div>
  );
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
