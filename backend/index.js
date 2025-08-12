import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import vehicleRoutes from "./routes/vehicles.js";
import expenseRoutes from "./routes/expenses.js";

import dns from "dns";
dns.setDefaultResultOrder("ipv4first");

dotenv.config();

const app = express();

// middleware
app.use(express.json());
app.use(
  cors({
    origin: "https://final-project-psi-ten.vercel.app",
    credentials: true,
  })
);

// routes
app.use("/api/auth", authRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/expenses", expenseRoutes);

const PORT = process.env.PORT || 5000;

function startServer() {
  mongoose
    .connect(process.env.MONGO_URI, { dbName: "vehicle_expenses" })
    .then(function () {
      console.log("MongoDB connected");
      app.listen(PORT, function () {
        console.log("Server running on port " + PORT);
      });
    })
    .catch(function (err) {
      console.error("MongoDB connection error:", err);
      process.exit(1);
    });
}

startServer();
