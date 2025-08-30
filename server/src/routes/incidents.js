import { Router } from "express";
import { db } from "../data/db.js";
import { requireAuth } from "../middleware/auth.js";
import { nanoid } from "nanoid";

const router = Router();

router.get("/", requireAuth, (req, res) => {
  const items = db.incidents.filter(i => i.userId === req.user.id);
  res.json(items);
});

router.post("/", requireAuth, (req, res) => {
  const { type, description, location, lat, lng, photo } = req.body;
  if (!type || !description) return res.status(400).json({ message: "Type and description are required" });
  const inc = {
    id: nanoid(),
    userId: req.user.id,
    type,
    description,
    location: location || "",
    lat: lat || "",
    lng: lng || "",
    photo: photo || null,
    timestamp: Date.now()
  };
  db.incidents.push(inc);
  res.json(inc);
});

export default router;
