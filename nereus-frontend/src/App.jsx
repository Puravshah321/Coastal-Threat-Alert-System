import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ReportIncident from "./pages/ReportIncident.jsx";
import Alerts from "./pages/Alerts.jsx";
import NotFound from "./pages/NotFound.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route
            path="/report"
            element={<ProtectedRoute><ReportIncident /></ProtectedRoute>}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
