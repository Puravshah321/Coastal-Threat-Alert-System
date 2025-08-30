import { useEffect, useState } from "react";
import api from "../utils/api.js";
import AlertCard from "../components/AlertCard.jsx";

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/alerts");
        setAlerts(data);
      } catch (err) {
        setError(err.message || "Failed to load alerts");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h2 className="text-2xl font-bold mb-4">Active Alerts</h2>
      {loading && <div>Loading…</div>}
      {error && <div className="text-red-400">{error}</div>}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {alerts.map(a => <AlertCard key={a.id} alert={a} />)}
      </div>
    </div>
  );
}
