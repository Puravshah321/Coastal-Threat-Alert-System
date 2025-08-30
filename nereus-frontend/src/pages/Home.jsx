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
          <p className="mt-4 text-slate-800">
            Nereus analyses sensors, satellites, and community reports to forecast threats like storm surges,
            erosion, and pollution so responders can act faster.
          </p>
          <div className="mt-6 flex gap-3">
            <Link to="/alerts" className="px-5 py-3 rounded-2xl bg-brand-600 hover:bg-brand-500 shadow-glow">View Alerts</Link>
            <Link to="/report" className="px-5 py-3 rounded-2xl bg-black/40 hover:bg-black/50">Report Incident</Link>
          </div>
        </motion.div>
        <motion.div
  className="glass rounded-3xl border border-gray-700 p-6 bg-black/30 backdrop-blur-md"
  initial={{ opacity: 0, scale: 0.95 }}
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
      <div
        key={m.k}
        className="rounded-2xl bg-gray-800 p-4"   // darker card background
      >
        <div className="text-xs text-white/70">{m.k}</div>  {/* subtle white */}
        <div className="text-2xl font-bold mt-1 text-white">{m.v}</div>
      </div>
    ))}
  </div>
  <p className="text-xs text-slate-400 mt-4">
    * Demo metrics; connect your backend for live stats.
  </p>
</motion.div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 grid md:grid-cols-3 gap-6">
        {[
          { t: "AI-driven anomaly detection", d: "Spot unusual tides, weather shifts, or pollution spikes before they become disasters." },
          { t: "Seamless data fusion", d: "Integrates satellites, sensors, and historical records into one trusted picture." },
          { t: "Actionable insights", d: "Clear dashboards and alerts turn complex data into decisions that save lives." },
        ].map((f) => (
          <div key={f.t} className="bg-gray-700 rounded-2xl p-6">
            <h3 className="font-semibold text-white">{f.t}</h3>
            <p className="text-sm text-slate-300 mt-2">{f.d}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-800 hover:text-slate-600 transition-colors duration-300 hover:scale-105 transform">
      How Nereus Works
    </h2>
    <p className="mt-2 text-center text-slate-900 hover:text-slate-500 max-w-2xl mx-auto transition-colors duration-300">
      From data ingestion to actionable alerts — here’s how our platform
      protects coasts and communities step by step.
    </p>
        <div className="mt-10 grid md:grid-cols-4 gap-6">
          {[
            {
              step: "1",
              title: "Ingest Data",
              desc: "Collects real-time inputs from tide gauges, weather stations, satellites, and citizen reports.",
            },
            {
              step: "2",
              title: "Run AI Models",
              desc: "Processes patterns and anomalies with machine learning models trained for coastal threats.",
            },
            {
              step: "3",
              title: "Generate Alerts",
              desc: "Issues early warnings with high accuracy, reducing response time and improving preparedness.",
            },
            {
              step: "4",
              title: "Support Action",
              desc: "Provides dashboards and notifications to governments, NGOs, and communities — with carbon footprint insights for each region.",
            },
          ].map((s) => (
            <div
              key={s.step}
              className="rounded-2xl bg-gray-800 p-6 flex flex-col items-center text-center"
            >
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-brand-600 text-white font-bold">
                {s.step}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-white">
                {s.title}
              </h3>
              <p className="mt-2 text-sm text-slate-300">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
