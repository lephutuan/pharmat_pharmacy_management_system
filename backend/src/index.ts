import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import medicinesRoutes from "./routes/medicines.js";
import inventoryRoutes from "./routes/inventory.js";
import salesRoutes from "./routes/sales.js";
import staffRoutes from "./routes/staff.js";
import membersRoutes from "./routes/members.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/medicines", medicinesRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/members", membersRoutes);

// Root route - API info
app.get("/", (req, res) => {
  res.json({
    name: "PharmaT API",
    version: "1.0.0",
    status: "running",
    endpoints: {
      health: "/api/health",
      auth: "/api/auth",
      medicines: "/api/medicines",
      inventory: "/api/inventory",
      sales: "/api/sales",
      staff: "/api/staff",
      members: "/api/members",
    },
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "PharmaT API is running" });
});

// Error handling middleware
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
  }
);

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
