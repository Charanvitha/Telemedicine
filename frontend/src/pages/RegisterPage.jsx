import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setError("");
      await register({
        ...form,
        experience: form.experience ? Number(form.experience) : undefined
      });
      navigate("/dashboard");
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="mx-auto max-w-2xl rounded-3xl border border-slate-800 bg-slate-900/70 p-8">
      <h1 className="text-3xl font-semibold text-white">Create account</h1>
      <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
        <input
          className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3"
          placeholder="Full name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3"
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <select
          className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="patient">Patient</option>
          <option value="doctor">Doctor</option>
        </select>
        <input
          className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3"
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        {form.role === "doctor" ? (
          <>
            <input
              className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3"
              placeholder="Specialization"
              value={form.specialization}
              onChange={(e) => setForm({ ...form, specialization: e.target.value })}
            />
            <input
              className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3"
              placeholder="Experience (years)"
              value={form.experience}
              onChange={(e) => setForm({ ...form, experience: e.target.value })}
            />
            <textarea
              className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 md:col-span-2"
              placeholder="Doctor bio"
              rows="4"
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
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
