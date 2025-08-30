import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e')",
      }}
    >
      <section className="mx-auto max-w-7xl px-4 pt-16 pb-20 grid md:grid-cols-2 gap-10 items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Protect coasts. <span className="text-brand-400">Save lives.</span>
          </h1>
          <p className="mt-4 text-slate-300">
            Nereus analyses sensors, satellites, and community reports to forecast threats like storm surges,
            erosion, and pollution so responders can act faster.
          </p>
          <div className="mt-6 flex gap-3">
            <Link to="/alerts" className="px-5 py-3 rounded-2xl bg-brand-600 hover:bg-brand-500 shadow-glow">View Alerts</Link>
            <Link to="/report" className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20">Report Incident</Link>
          </div>
        </motion.div>
        <motion.div
          className="glass rounded-3xl border border-white/10 p-6"
          initial={{ opacity: 0, scale: .95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <div className="grid grid-cols-2 gap-4">
            {[
              { k: "Active Alerts", v: 7 },
              { k: "Communities", v: 42 },
              { k: "Incidents Reported", v: 138 },
              { k: "Avg. Response Time", v: "12m" }
            ].map((m) => (
              <div key={m.k} className="rounded-2xl bg-white/5 p-4">
                <div className="text-xs text-slate-400">{m.k}</div>
                <div className="text-2xl font-bold mt-1">{m.v}</div>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-4">* Demo metrics; connect your backend for live stats.</p>
        </motion.div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 grid md:grid-cols-3 gap-6">
        {[
          { t: "Hyperlocal predictions", d: "Explainable AI models tuned to your coastline."},
          { t: "Citizen + sensor fusion", d: "Blend validated reports with real‑time telemetry."},
          { t: "Resilient alerts", d: "SMS, WhatsApp, email and dashboard notifications."},
        ].map((f) => (
          <div key={f.t} className="glass rounded-2xl p-6 border border-white/10">
            <h3 className="font-semibold">{f.t}</h3>
            <p className="text-sm text-slate-300 mt-2">{f.d}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
