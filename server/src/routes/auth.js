import { Router } from "express";
import jwt from "jsonwebtoken";
import { db } from "../data/db.js";

const router = Router();

function sign(user) {
  const payload = { id: user.id, email: user.email, name: user.name };
  const token = jwt.sign(payload, process.env.JWT_SECRET || "dev_secret_change_me", { expiresIn: "7d" });
  return { token, user: payload };
  }

router.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: "Missing fields" });
  const exists = db.users.find(u => u.email === email);
  if (exists) return res.status(409).json({ message: "Email already registered" });
  const id = "u_" + (db.users.length+1);
  const user = { id, name, email, password };
  db.users.push(user);
  return res.json(sign(user));
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = db.users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ message: "Invalid credentials" });
  return res.json(sign(user));
});

export default router;
