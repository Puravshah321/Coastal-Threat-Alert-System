export default function AlertCard({ alert }) {
  return (
    <div className="glass rounded-2xl p-4 border border-white/10 hover:shadow-glow transition">
      <div className="flex items-center justify-between mb-2">
        <span className="px-2 py-0.5 rounded-lg text-xs bg-brand-600">{alert.severity}</span>
        <span className="text-xs text-slate-400">{new Date(alert.timestamp).toLocaleString()}</span>
      </div>
      <h3 className="font-semibold mb-1">{alert.title}</h3>
      <p className="text-sm text-slate-300">{alert.description}</p>
      <div className="text-xs text-slate-400 mt-2">Location: {alert.location}</div>
    </div>
  );
}
