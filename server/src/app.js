import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import pokemonRoutes from "./routes/pokemonRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      const isLocalhost =
        typeof origin === "string" &&
        /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);

      if (!origin || isLocalhost || origin === process.env.CLIENT_URL) {
        return callback(null, true);
      }
      return callback(new Error("CORS blocked"));
    },
  })
);
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/auth", authRoutes);
app.use("/api/pokemon", pokemonRoutes);
app.use("/api/favorites", favoriteRoutes);

export default app;
