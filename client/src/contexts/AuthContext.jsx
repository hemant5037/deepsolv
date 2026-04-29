import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api, setAuthToken } from "../api";

const AuthContext = createContext(null);

const AUTH_STORAGE_KEY = "pokedex-lite-auth";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem(AUTH_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      setToken(parsed.token);
      setUser(parsed.user);
      setAuthToken(parsed.token);
    }
    setAuthLoading(false);
  }, []);

  const login = async ({ email, password }) => {
    const response = await api.post("/auth/login", { email, password });
    const authPayload = response.data;
    setToken(authPayload.token);
    setUser(authPayload.user);
    setAuthToken(authPayload.token);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authPayload));
  };

  const register = async ({ name, email, password }) => {
    const response = await api.post("/auth/register", { name, email, password });
    const authPayload = response.data;
    setToken(authPayload.token);
    setUser(authPayload.user);
    setAuthToken(authPayload.token);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authPayload));
  };

  const logout = () => {
    setToken("");
    setUser(null);
    setAuthToken("");
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      authLoading,
      isAuthenticated: Boolean(token),
      login,
      register,
      logout,
    }),
    [user, token, authLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
