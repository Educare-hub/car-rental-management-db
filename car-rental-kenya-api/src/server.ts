import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import "express-async-errors";
import { getPool } from "./config/db"; 
import customerRoutes from "./routes/customerRoutes";
import carRoutes from "./routes/carRoutes";
import authRoutes from "./routes/authRoutes";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Register routes
app.use("/api/customers", customerRoutes);
app.use("/api/cars", carRoutes);
app.use("/api/auth", authRoutes);

// Test route to check DB connection
app.get("/", async (req, res) => {
  try {
    const pool = await getPool(); // 👈 get the DB connection pool
    const result = await pool.request().query("SELECT TOP 3 * FROM Car");
    res.status(200).json({
      app: process.env.APP_NAME || "CarRentalKenyaAPI",
      message: "✅ API is running and connected to the Kenya DB!",
      cars: result.recordset,
    });
  } catch (error: any) {
    console.error("❌ Root route error:", error.message);
    res.status(500).json({ message: "Database connection failed" });
  }
});

// Handle 404 routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Start server and initialize DB
const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`🚗 CarRentalKenyaAPI running on http://localhost:${PORT}`);
  try {
    await getPool(); // 👈 initializes DB connection once at startup
    console.log("✅ Database connection established at startup");
  } catch (error: any) {
    console.error("❌ Database connection failed on startup:", error.message);
  }
});
