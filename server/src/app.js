import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import pokemonRoutes from "./routes/pokemonRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";

const app = express();
const vercelFrontendOrigin = "https://deepsolv-two.vercel.app";

const normalizeOrigin = (value = "") => value.replace(/\/$/, "");

app.use(
  cors({
    origin: (origin, callback) => {
      const isLocalhost =
        typeof origin === "string" &&
        /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);

      const normalizedOrigin = normalizeOrigin(origin || "");
      const normalizedClientUrl = normalizeOrigin(process.env.CLIENT_URL || "");

      if (
        !origin ||
        isLocalhost ||
        normalizedOrigin === normalizedClientUrl ||
        normalizedOrigin === vercelFrontendOrigin
      ) {
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
