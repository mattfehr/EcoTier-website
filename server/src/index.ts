import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import productsRouter from "./routes/productsRoutes";
import userRouter from "./routes/userRoutes";
import favoritesRouter from "./routes/favoritesRoutes";
import cartRouter from "./routes/cartRoutes";
import ordersRouter from "./routes/orderRoutes";
import commentsRouter from "./routes/commentsRoutes";

dotenv.config();

const app = express();

// --- CORS Configuration ---
app.use(
  cors({
    origin: [
      "http://localhost:5173",       // Local Vite dev server
      "https://eco-tier-website-ix3l.vercel.app",        // Your Vercel deployment
      "https://ecotier.vercel.app",                      // (optional older URL)
    ],
    credentials: true,
  })
);

// --- Middleware ---
app.use(express.json());

// --- Root & Health Routes ---
app.get("/", (_req, res) => {
  res.send("🌿 EcoTier API is running");
});

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

// --- API Routes ---
app.use("/api/products", productsRouter);
app.use("/api/users", userRouter);
app.use("/api/favorites", favoritesRouter);
app.use("/api/cart", cartRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/comments", commentsRouter);

// --- Server Startup ---
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});