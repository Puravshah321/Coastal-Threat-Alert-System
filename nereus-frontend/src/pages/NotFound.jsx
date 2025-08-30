import { Link } from "react-router-dom";
export default function NotFound(){
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h2 className="text-3xl font-bold">Page not found</h2>
      <p className="text-slate-400 mt-2">The page you’re looking for doesn’t exist.</p>
      <Link to="/" className="inline-block mt-6 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500">Go Home</Link>
    </div>
  )
}
