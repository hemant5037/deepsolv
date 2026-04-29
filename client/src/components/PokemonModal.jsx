const PokemonModal = ({ pokemon, onClose }) => {
  if (!pokemon) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(event) => event.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          X
        </button>
        <img src={pokemon.image} alt={pokemon.name} />
        <h2>{pokemon.name}</h2>
        <div className="modal-meta">
          <p>Height: {pokemon.height}</p>
          <p>Weight: {pokemon.weight}</p>
          <p>Base EXP: {pokemon.baseExperience}</p>
        </div>
        <p className="abilities-text">Abilities: {pokemon.abilities.join(", ")}</p>
        <div className="stats-grid">
          {pokemon.stats.map((stat) => (
            <div key={stat.name} className="stat-item">
              <span>{stat.name}</span>
              <strong>{stat.value}</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PokemonModal;
