import jwt from "jsonwebtoken";

export default function auth(req, res, next) {
  try {
    const header = req.headers["authorization"];
    if (!header) {
      return res.status(401).json({ message: "No token" });
    }
    const parts = header.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({ message: "Invalid token format" });
    }
    const token = parts[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}
