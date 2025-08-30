import { useState } from "react";
import { useAuth } from "../state/AuthContext.jsx";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await register(name, email, password);
      navigate("/");
    } catch (err) {
      setError(err.message || "Registration failed");
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h2 className="text-2xl font-bold mb-4">Create an account</h2>
      <form onSubmit={onSubmit} className="space-y-4 glass p-6 rounded-2xl border border-white/10">
        {error && <div className="text-sm text-red-400">{error}</div>}
        <div>
          <label className="text-sm text-slate-300">Name</label>
          <input required value={name} onChange={e=>setName(e.target.value)} className="w-full mt-1 bg-slate-900 border border-white/10 rounded-xl px-3 py-2" />
        </div>
        <div>
          <label className="text-sm text-slate-300">Email</label>
          <input type="email" required value={email} onChange={e=>setEmail(e.target.value)} className="w-full mt-1 bg-slate-900 border border-white/10 rounded-xl px-3 py-2" />
        </div>
        <div>
          <label className="text-sm text-slate-300">Password</label>
          <input type="password" required value={password} onChange={e=>setPassword(e.target.value)} className="w-full mt-1 bg-slate-900 border border-white/10 rounded-xl px-3 py-2" />
        </div>
        <button className="w-full px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500">Register</button>
        <div className="text-sm text-slate-400">
          Already have an account? <Link to="/login" className="text-brand-300">Login</Link>
        </div>
      </form>
    </div>
  );
}
