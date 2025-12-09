import express from "express";


import dotenv from "dotenv";

dotenv.config();

console.log("Loaded GEMINI API KEY:", process.env.GEMINI_API_KEY ? "YES" : "NO");

import cors from "cors";
import { connectDB } from "./config/db.js";
import productRoutes from "./routes/product.routes.js";
import eventRoutes from "./routes/event.routes.js";
import recommendRoutes from "./routes/recommend.routes.js";
import seedRoutes from "./routes/seed.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ message: "E-commerce Recommender API is running" });
});

app.use("/api/products", productRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/recommend", recommendRoutes);
app.use("/api/seed", seedRoutes);

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
};

start();
