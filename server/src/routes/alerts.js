import { Router } from "express";
import { db } from "../data/db.js";

const router = Router();

router.get("/", (_, res) => {
  // Return newest first
  const out = [...db.alerts].sort((a,b)=>b.timestamp-a.timestamp);
  res.json(out);
});

export default router;
