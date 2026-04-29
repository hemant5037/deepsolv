export const extractPokemonId = (url = "") => {
  const parts = url.split("/").filter(Boolean);
  return Number(parts[parts.length - 1]);
};

export const toPokemonCard = (details) => ({
  id: details.id,
  name: details.name,
  image:
    details.sprites.other?.["official-artwork"]?.front_default ||
    details.sprites.front_default ||
    "",
  types: details.types.map((item) => item.type.name),
});
