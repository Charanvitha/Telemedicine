import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const getApiErrorMessage = (apiError) => {
  if (apiError.response?.data?.message) {
    return apiError.response.data.message;
  }

  if (typeof apiError.response?.data === "string" && apiError.response.data.trim()) {
    return `Request failed (${apiError.response.status}): ${apiError.response.data.slice(0, 120)}`;
  }

  if (Array.isArray(apiError.response?.data?.errors) && apiError.response.data.errors.length > 0) {
    return apiError.response.data.errors[0].msg;
  }

  if (apiError.response?.status) {
    return `Request failed with status ${apiError.response.status}`;
  }

  if (apiError.code === "ERR_NETWORK") {
    return "Unable to reach the server. Please confirm the backend is running.";
  }

  return "Registration failed";
};

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, loading } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "patient",
    phone: "",
    specialization: "",
    bio: "",
    experience: ""
  });
  const [error, setError] = useState("");

  const updateField = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setError("");
      await register({
        ...form,
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        specialization: form.specialization.trim(),
        bio: form.bio.trim(),
        experience: form.experience ? Number(form.experience) : undefined
      });
      navigate("/dashboard");
    } catch (apiError) {
      setError(getApiErrorMessage(apiError));
    }
  };

  return (
    <div className="mx-auto max-w-2xl rounded-3xl border border-slate-800 bg-slate-900/70 p-8">
      <h1 className="text-3xl font-semibold text-white">Create account</h1>
      <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
        <input
          className="auth-field"
          autoComplete="name"
          placeholder="Full name"
          required
          value={form.name}
          onChange={(e) => updateField("name", e.target.value)}
        />
        <input
          className="auth-field"
          autoComplete="email"
          placeholder="Email"
          required
          type="email"
          value={form.email}
          onChange={(e) => updateField("email", e.target.value)}
        />
        <input
          className="auth-field"
          autoComplete="new-password"
          minLength={6}
          placeholder="Password"
          required
          type="password"
          value={form.password}
          onChange={(e) => updateField("password", e.target.value)}
        />
        <select
          className="auth-field"
          value={form.role}
          onChange={(e) => updateField("role", e.target.value)}
        >
          <option value="patient">Patient</option>
          <option value="doctor">Doctor</option>
        </select>
        <input
          className={`auth-field ${form.role === "patient" ? "md:col-span-2" : ""}`}
          autoComplete="tel"
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => updateField("phone", e.target.value)}
        />
        {form.role === "doctor" ? (
          <>
            <input
              className="auth-field"
              placeholder="Specialization"
              value={form.specialization}
              onChange={(e) => updateField("specialization", e.target.value)}
            />
            <input
              className="auth-field"
              min="0"
              type="number"
              placeholder="Experience (years)"
              value={form.experience}
              onChange={(e) => updateField("experience", e.target.value)}
            />
            <textarea
              className="auth-field md:col-span-2"
              placeholder="Doctor bio"
              rows="4"
              value={form.bio}
              onChange={(e) => updateField("bio", e.target.value)}
            />
          </>
        ) : null}
        {error ? <p className="text-sm text-rose-400 md:col-span-2">{error}</p> : null}
        <button
          className="rounded-2xl bg-brand-600 px-4 py-3 font-medium text-white md:col-span-2"
          disabled={loading}
          type="submit"
        >
          {loading ? "Creating account..." : "Register"}
        </button>
      </form>
      <p className="mt-4 text-sm text-slate-400">
        Already registered?{" "}
        <Link to="/login" className="text-brand-100">
          Login
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;
