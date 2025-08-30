import { useEffect, useState } from "react";
import api from "../utils/api.js";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, Tooltip, Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend);

export default function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        // fetch your reports list (for now just simulate or call your FastAPI endpoint if available)
        const r = await api.get("/reports"); // <-- create a FastAPI /reports endpoint
        setRows(r.data);

        // compute simple metrics on client side
        const total = r.data.length;
        const avgRisk = total ? r.data.reduce((s, x) => s + (x.prediction?.risk_score || 0), 0) / total : 0;
        const byRegion = Object.values(
          r.data.reduce((acc, x) => {
            const region = x.region_name || x.features?.region_name || "Unknown";
            acc[region] = acc[region] || { region, count: 0 };
            acc[region].count++;
            return acc;
          }, {})
        );
        const series = r.data.map(x => ({
          t: x.time_stamp || x.timestamp,
          risk: x.prediction?.risk_score || 0
        }));

        setMetrics({ total, avgRisk, byRegion, series });
      } catch (e) {
        console.error("Failed to load metrics:", e.message);
      }
    }
    load();
  }, []);

  if (!metrics) return <div className="p-4">Loading dashboard...</div>;

  const lineData = {
    labels: (metrics.series || []).map(p => new Date(p.t).toLocaleString()),
    datasets: [{
      label: "Risk Score",
      borderColor: "#3b82f6",
      backgroundColor: "rgba(59,130,246,0.5)",
      data: (metrics.series || []).map(p => p.risk)
    }]
  };

  const barData = {
    labels: (metrics.byRegion || []).map(p => p.region),
    datasets: [{
      label: "Incidents",
      backgroundColor: "rgba(16,185,129,0.6)",
      data: (metrics.byRegion || []).map(p => p.count)
    }]
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <h2 className="text-3xl font-extrabold">Dashboard</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-white/10 bg-slate-900/60">
          <div className="text-sm text-slate-400">Total Reports</div>
          <div className="text-2xl font-bold">{metrics.total}</div>
        </div>
        <div className="p-4 rounded-xl border border-white/10 bg-slate-900/60">
          <div className="text-sm text-slate-400">Average Risk</div>
          <div className="text-2xl font-bold">{metrics.avgRisk.toFixed(3)}</div>
        </div>
        <div className="p-4 rounded-xl border border-white/10 bg-slate-900/60">
          <div className="text-sm text-slate-400">Regions</div>
          <div className="text-2xl font-bold">{metrics.byRegion.length}</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 rounded-xl border border-white/10 bg-slate-900/60">
          <h3 className="font-bold mb-2">Risk over time</h3>
          <Line data={lineData} />
        </div>
        <div className="p-4 rounded-xl border border-white/10 bg-slate-900/60">
          <h3 className="font-bold mb-2">Incidents by region</h3>
          <Bar data={barData} />
        </div>
      </div>

      {/* Reports Table */}
      <div className="p-4 rounded-xl border border-white/10 bg-slate-900/60">
        <h3 className="font-bold mb-3">Your Reports</h3>
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead className="text-slate-300">
              <tr>
                <th className="text-left p-2">Time</th>
                <th className="text-left p-2">Region</th>
                <th className="text-left p-2">Risk Score</th>
                <th className="text-left p-2">Label</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              {rows.map((r, i) => (
                <tr key={i} className="border-t border-white/10">
                  <td className="p-2">{new Date(r.time_stamp || r.timestamp).toLocaleString()}</td>
                  <td className="p-2">{r.region_name || r.features?.region_name}</td>
                  <td className="p-2">{r.prediction?.risk_score?.toFixed?.(3) ?? r.prediction?.risk_score}</td>
                  <td className="p-2">{r.prediction?.label || r.predicted_risk_level}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
