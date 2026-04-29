import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema(
  {
    pokemonId: { type: Number, required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    types: [{ type: String }],
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    favorites: [favoriteSchema],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
