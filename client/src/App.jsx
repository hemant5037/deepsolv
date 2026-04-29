import { useEffect, useMemo, useState } from "react";
import { api } from "./api";
import AuthForm from "./components/AuthForm";
import Pagination from "./components/Pagination";
import PokemonCard from "./components/PokemonCard";
import PokemonModal from "./components/PokemonModal";
import { useAuth } from "./contexts/AuthContext";
import "./App.css";

const PAGE_LIMIT = 12;
const THEME_STORAGE_KEY = "pokedex-theme";

function App() {
  const { user, isAuthenticated, authLoading, logout } = useAuth();
  const [pokemonList, setPokemonList] = useState([]);
  const [types, setTypes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme) return savedTheme === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    document.body.classList.toggle("dark", isDark);
    localStorage.setItem(THEME_STORAGE_KEY, isDark ? "dark" : "light");
  }, [isDark]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchTypes = async () => {
      const response = await api.get("/pokemon/types");
      setTypes(response.data.types);
    };

    const fetchFavorites = async () => {
      const response = await api.get("/favorites");
      setFavorites(response.data.favorites);
      localStorage.setItem("pokedex-favorites-cache", JSON.stringify(response.data.favorites));
    };

    fetchTypes().catch(() => setError("Could not load types"));
    fetchFavorites().catch(() => setError("Could not load favorites"));
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;

    setLoading(true);
    setError("");
    api
      .get("/pokemon", {
        params: { page, limit: PAGE_LIMIT, search, type: selectedType },
      })
      .then((response) => {
        setPokemonList(response.data.results);
        setTotalPages(response.data.totalPages || 1);
      })
      .catch(() => setError("Could not load Pokemon list"))
      .finally(() => setLoading(false));
  }, [page, search, selectedType, isAuthenticated]);

  useEffect(() => {
    setPage(1);
  }, [search, selectedType]);

  const favoriteIds = useMemo(() => new Set(favorites.map((fav) => fav.pokemonId)), [favorites]);

  const handleToggleFavorite = async (pokemon) => {
    try {
      if (favoriteIds.has(pokemon.id)) {
        const response = await api.delete(`/favorites/${pokemon.id}`);
        setFavorites(response.data.favorites);
      } else {
        const response = await api.post("/favorites", {
          pokemonId: pokemon.id,
          name: pokemon.name,
          image: pokemon.image,
          types: pokemon.types,
        });
        setFavorites(response.data.favorites);
      }
    } catch {
      setError("Could not update favorites");
    }
  };

  const openDetails = async (pokemon) => {
    try {
      const response = await api.get(`/pokemon/${pokemon.id}`);
      setSelectedPokemon(response.data);
    } catch {
      setError("Could not load Pokemon details");
    }
  };

  if (authLoading) {
    return <div className="center-state">Loading session...</div>;
  }

  if (!isAuthenticated) {
    return <AuthForm />;
  }

  return (
    <main className="app-shell">
      <div className="pokemon-bg-layer" aria-hidden="true">
        <span className="pokeball ball-1" />
        <span className="pokeball ball-2" />
        <span className="pokeball ball-3" />
        <span className="pokeball ball-4" />
        <span className="pokeball ball-5" />
      </div>
      <header className="top-bar">
        <div className="title-wrap">
          <h1>Pokedex Lite</h1>
          <p>Welcome back, {user?.name}</p>
          <div className="quick-stats">
            <span>{favorites.length} favorites</span>
            <span>{pokemonList.length} on this page</span>
          </div>
        </div>
        <div className="header-actions">
          <button className="theme-btn" onClick={() => setIsDark((prev) => !prev)}>
            {isDark ? "Light Mode" : "Dark Mode"}
          </button>
          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      <section className="controls">
        <input
          type="text"
          placeholder="Search Pokemon..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <select value={selectedType} onChange={(event) => setSelectedType(event.target.value)}>
          <option value="">All types</option>
          {types.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </section>

      {error && <p className="error-text">{error}</p>}
      {loading ? (
        <div className="center-state loading-state">
          <span className="spinner" />
          <span>Loading Pokemon...</span>
        </div>
      ) : (
        <section className="pokemon-grid">
          {pokemonList.map((pokemon, index) => (
            <PokemonCard
              key={pokemon.id}
              pokemon={pokemon}
              index={index}
              isFavorite={favoriteIds.has(pokemon.id)}
              onToggleFavorite={handleToggleFavorite}
              onOpenDetails={openDetails}
            />
          ))}
        </section>
      )}

      <Pagination
        page={page}
        totalPages={totalPages}
        onPrev={() => setPage((prev) => Math.max(1, prev - 1))}
        onNext={() => setPage((prev) => Math.min(totalPages, prev + 1))}
      />
      <PokemonModal pokemon={selectedPokemon} onClose={() => setSelectedPokemon(null)} />
    </main>
  );
}

export default App;
