import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const initialForm = { name: "", email: "", password: "" };

const AuthForm = () => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      if (mode === "login") {
        await login({ email: form.email, password: form.password });
      } else {
        await register(form);
      }
      setForm(initialForm);
    } catch (err) {
      setError(err.response?.data?.message || "Authentication failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="pokemon-bg-layer" aria-hidden="true">
        <span className="pokeball ball-1" />
        <span className="pokeball ball-2" />
        <span className="pokeball ball-3" />
        <span className="pokeball ball-4" />
        <span className="pokeball ball-5" />
      </div>
      <div className="auth-bg-pattern" />
      <form className="auth-card" onSubmit={onSubmit}>
        <h1>Pokedex Lite</h1>
        <p>{mode === "login" ? "Sign in to continue" : "Create your trainer account"}</p>
        {mode === "register" && (
          <input
            name="name"
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={onChange}
            required
          />
        )}
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={onChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={onChange}
          required
          minLength={6}
        />
        {error && <p className="error-text">{error}</p>}
        <button disabled={submitting} type="submit">
          {submitting ? "Please wait..." : mode === "login" ? "Login" : "Register"}
        </button>
        <button
          className="link-btn"
          type="button"
          onClick={() => setMode((prev) => (prev === "login" ? "register" : "login"))}
        >
          {mode === "login" ? "No account? Register" : "Already have an account? Login"}
        </button>
      </form>
    </div>
  );
};

export default AuthForm;
