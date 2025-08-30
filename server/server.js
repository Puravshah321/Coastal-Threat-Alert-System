import express from "express";
import morgan from "morgan";
import cors from "cors";
import authRoutes from "./src/routes/auth.js";
import incidentRoutes from "./src/routes/incidents.js";
import alertsRoutes from "./src/routes/alerts.js";

const app = express();
app.use(morgan("dev"));
app.use(cors({ origin: true }));
app.use(express.json({ limit: "10mb" }));

app.get("/api/health", (_, res) => res.json({ ok: true }));
app.use("/api/auth", authRoutes);
app.use("/api/incidents", incidentRoutes);
app.use("/api/alerts", alertsRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
