import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setError("");
      await login(form);
      navigate(location.state?.from?.pathname || "/dashboard");
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-3xl border border-slate-800 bg-slate-900/70 p-8">
      <h1 className="text-3xl font-semibold text-white">Sign in</h1>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <input
          className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3"
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        {error ? <p className="text-sm text-rose-400">{error}</p> : null}
        <button
          className="w-full rounded-2xl bg-brand-600 px-4 py-3 font-medium text-white"
          disabled={loading}
          type="submit"
        >
          {loading ? "Signing in..." : "Login"}
        </button>
      </form>
      <p className="mt-4 text-sm text-slate-400">
        Need an account?{" "}
        <Link to="/register" className="text-brand-100">
          Register
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
