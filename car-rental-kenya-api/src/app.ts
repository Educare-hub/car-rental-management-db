import express from "express";
import dotenv from "dotenv";
import { errorHandler } from "./middleware/errorHandler"; // ✅ import middleware
import authRoutes from "./routes/authRoutes"; // ✅ example route file

dotenv.config();

const app = express();

// ✅ Built-in middleware
app.use(express.json());

// ✅ Register routes
app.use("/api/auth", authRoutes);

// ✅ Global error handler (always last)
app.use(errorHandler);

export default app;
