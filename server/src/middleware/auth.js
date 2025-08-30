import jwt from "jsonwebtoken";

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "Missing token" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev_secret_change_me");
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}
