import express from "express";
import { extractPokemonId, toPokemonCard } from "../utils/pokemonMapper.js";

const router = express.Router();
const POKE_API = "https://pokeapi.co/api/v2";
const defaultHeaders = {
  Accept: "application/json",
  "User-Agent": "PokedexLite/1.0",
};

const pokeGet = async (url) => {
  const response = await fetch(url, { headers: defaultHeaders });
  if (!response.ok) {
    throw new Error(`PokéAPI request failed: ${response.status}`);
  }
  return response.json();
};

router.get("/", async (req, res) => {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 20);
    const search = (req.query.search ?? "").toLowerCase().trim();
    const type = (req.query.type ?? "").toLowerCase().trim();
    const offset = (page - 1) * limit;

    let sourceResults = [];
    let count = 0;

    if (type) {
      const typeResponse = await pokeGet(`${POKE_API}/type/${type}`);
      const mappedList = typeResponse.pokemon.map((entry) => entry.pokemon);
      const searchedList = mappedList.filter((item) =>
        item.name.toLowerCase().includes(search)
      );
      count = searchedList.length;
      sourceResults = searchedList.slice(offset, offset + limit);
    } else {
      const listResponse = await pokeGet(`${POKE_API}/pokemon?limit=${limit}&offset=${offset}`);
      count = listResponse.count;
      sourceResults = search
        ? listResponse.results.filter((item) => item.name.toLowerCase().includes(search))
        : listResponse.results;
    }

    const detailRequests = sourceResults.map((item) => pokeGet(item.url));
    const detailResponses = await Promise.all(detailRequests);
    const results = detailResponses.map((details) => toPokemonCard(details));

    return res.json({
      page,
      limit,
      count,
      totalPages: Math.ceil(count / limit),
      results,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch Pokemon list" });
  }
});

router.get("/types", async (_req, res) => {
  try {
    const response = await pokeGet(`${POKE_API}/type`);
    const types = response.results.map((type) => type.name);
    return res.json({ types });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch Pokemon types" });
  }
});

router.get("/:identifier", async (req, res) => {
  try {
    const identifier = req.params.identifier;
    const details = await pokeGet(`${POKE_API}/pokemon/${identifier}`);

    return res.json({
      id: details.id,
      name: details.name,
      image:
        details.sprites.other?.["official-artwork"]?.front_default ||
        details.sprites.front_default ||
        "",
      height: details.height,
      weight: details.weight,
      baseExperience: details.base_experience,
      types: details.types.map((item) => item.type.name),
      abilities: details.abilities.map((item) => item.ability.name),
      stats: details.stats.map((item) => ({
        name: item.stat.name,
        value: item.base_stat,
      })),
      pokemonId: extractPokemonId(`${POKE_API}/pokemon/${details.id}/`),
    });
  } catch (error) {
    return res.status(404).json({ message: "Pokemon not found" });
  }
});

export default router;
