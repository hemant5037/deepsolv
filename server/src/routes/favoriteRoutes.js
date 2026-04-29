import express from "express";
import User from "../models/User.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("favorites");
    return res.json({ favorites: user?.favorites ?? [] });
  } catch (error) {
    return res.status(500).json({ message: "Failed to load favorites" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { pokemonId, name, image, types } = req.body;

    if (!pokemonId || !name || !image) {
      return res.status(400).json({ message: "pokemonId, name and image are required" });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const alreadyFavorite = user.favorites.some((fav) => fav.pokemonId === pokemonId);
    if (alreadyFavorite) {
      return res.status(409).json({ message: "Pokemon already in favorites" });
    }

    user.favorites.push({ pokemonId, name, image, types: types ?? [] });
    await user.save();

    return res.status(201).json({ favorites: user.favorites });
  } catch (error) {
    return res.status(500).json({ message: "Failed to add favorite" });
  }
});

router.delete("/:pokemonId", async (req, res) => {
  try {
    const pokemonId = Number(req.params.pokemonId);
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.favorites = user.favorites.filter((fav) => fav.pokemonId !== pokemonId);
    await user.save();

    return res.json({ favorites: user.favorites });
  } catch (error) {
    return res.status(500).json({ message: "Failed to remove favorite" });
  }
});

export default router;
