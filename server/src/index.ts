// index.ts
import express from "express";
import serverless from "serverless-http";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import { errorHandler } from "./middlewares/errorHandler";

// Import your routes
import menuRoutes from "./routes/menuRoutes";
import orderRoutes from "./routes/orderRoutes";
import adminRoutes from "./routes/adminRoutes";
import loyaltyRoutes from "./routes/loyaltyRoutes";
import healthRoutes from "./routes/healthRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import RegistrationRoutes from "./routes/RegistrationRoutes";
import DiscountRoutes from "./routes/DiscountRoutes";
import { migrateOrderNumbers } from "./utils/migrateOrderNumbers";

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Create Express app
const app = express();

// CORS middleware
const allowedOrigins = [
  "https://pos-frontend-cjom.vercel.app",
  "http://localhost:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3000",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow Postman / server-side
      if (allowedOrigins.indexOf(origin) === -1) {
        return callback(new Error(`CORS policy: ${origin} not allowed`), false);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// JSON parsing middleware
app.use(express.json());

// Routes
app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/loyalty", loyaltyRoutes);
app.use("/api", healthRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api", DiscountRoutes);
app.use("/api/new", RegistrationRoutes);

// Error handler
app.use(errorHandler);

// Optional: run migrations on deployment
(async () => {
  try {
    await migrateOrderNumbers();
    console.log("Migration completed");
  } catch (error) {
    console.error("Migration failed:", error);
  }
})();

// Export Vercel serverless handler
export const handler = serverless(app);
