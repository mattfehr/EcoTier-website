import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import productsRouter from "./routes/productsRoutes";
import userRouter from "./routes/userRoutes";
import favoritesRouter from "./routes/favoritesRoutes"; // ✅ import

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Base route
app.get("/", (_req, res) => {
  res.send("EcoTier API is running");
});

// Health check
app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

// API routes
app.use("/api/products", productsRouter);
app.use("/api/users", userRouter);
app.use("/api/favorites", favoritesRouter); // ✅ mount

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
