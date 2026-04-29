const PokemonCard = ({ pokemon, index, isFavorite, onToggleFavorite, onOpenDetails }) => (
  <article
    className={`pokemon-card type-${pokemon.types[0] || "normal"}`}
    style={{ animationDelay: `${index * 35}ms` }}
  >
    <button className="favorite-btn" onClick={() => onToggleFavorite(pokemon)}>
      {isFavorite ? "★" : "☆"}
    </button>
    <button className="details-trigger" onClick={() => onOpenDetails(pokemon)}>
      <img src={pokemon.image} alt={pokemon.name} loading="lazy" />
      <h3>{pokemon.name}</h3>
      <div className="type-list">
        {pokemon.types.map((type) => (
          <span key={type} className={`type-pill type-chip-${type}`}>
            {type}
          </span>
        ))}
      </div>
    </button>
  </article>
);

export default PokemonCard;
