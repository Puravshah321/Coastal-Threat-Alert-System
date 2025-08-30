import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../state/AuthContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur border-b border-white/10">
      <nav className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-2xl bg-brand-500 shadow-glow grid place-items-center font-black">N</div>
          <span className="font-semibold tracking-wide">Nereus</span>
        </Link>
        <div className="hidden md:flex items-center gap-6">
          <NavLink to="/" className={({isActive}) => isActive ? "text-brand-300" : "text-slate-200 hover:text-white"}>Home</NavLink>
          <NavLink to="/alerts" className={({isActive}) => isActive ? "text-brand-300" : "text-slate-200 hover:text-white"}>Alerts</NavLink>
          <NavLink to="/report" className={({isActive}) => isActive ? "text-brand-300" : "text-slate-200 hover:text-white"}>Report Incident</NavLink>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="hidden sm:inline text-sm text-slate-300">Hi, {user.name.split(" ")[0]}</span>
              <button onClick={() => { logout(); navigate("/login"); }} className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20">Logout</button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20">Login</NavLink>
              <NavLink to="/register" className="px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500">Register</NavLink>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
