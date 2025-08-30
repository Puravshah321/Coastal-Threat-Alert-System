export default function Footer() {
  return (
    <footer className="border-t border-white/10 mt-24">
      <div className="mx-auto max-w-7xl px-4 py-10 grid gap-6 md:grid-cols-3">
        <div>
          <h3 className="font-semibold mb-2">Nereus</h3>
          <p className="text-sm text-slate-400">Coastal early warnings, community reports, and blue‑carbon stewardship.</p>
        </div>
        <div>
          <h4 className="font-medium mb-2">Links</h4>
          <ul className="space-y-1 text-sm text-slate-300">
            <li><a href="/">Home</a></li>
            <li><a href="/alerts">Alerts</a></li>
            <li><a href="/report">Report Incident</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-medium mb-2">Built With</h4>
          <p className="text-sm text-slate-300">React, Tailwind, Framer Motion, Node/Express, JWT</p>
        </div>
      </div>
      <div className="text-center text-xs text-slate-500 pb-6">© {new Date().getFullYear()} Nereus.</div>
    </footer>
  );
}
