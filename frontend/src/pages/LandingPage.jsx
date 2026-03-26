import { Link } from "react-router-dom";

const LandingPage = () => (
  <section className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
    <div>
      <p className="mb-3 inline-flex rounded-full border border-brand-500/40 bg-brand-500/10 px-4 py-1 text-sm text-brand-100">
        Remote care for patients, doctors, and admins
      </p>
      <h1 className="max-w-3xl text-5xl font-bold leading-tight text-white">
        A complete telemedicine platform for secure consultations and clinical workflows.
      </h1>
      <p className="mt-6 max-w-2xl text-lg text-slate-300">
        Book appointments, join WebRTC video sessions, upload reports, and generate e-prescriptions
        from a single role-aware application.
      </p>
      <div className="mt-8 flex flex-wrap gap-4">
        <Link to="/register" className="rounded-full bg-brand-600 px-6 py-3 font-medium text-white">
          Create account
        </Link>
        <Link
          to="/login"
          className="rounded-full border border-slate-700 px-6 py-3 font-medium text-slate-100"
        >
          Sign in
        </Link>
      </div>
    </div>
    <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-slate-950/40">
      <div className="grid gap-4 sm:grid-cols-2">
        {[
          ["Patients", "Book doctors, manage records, join calls"],
          ["Doctors", "Set availability, consult, prescribe"],
          ["Admin", "Track users and appointment analytics"],
          ["Security", "JWT auth, validation, protected routes"]
        ].map(([title, copy]) => (
          <div key={title} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <p className="mt-2 text-sm text-slate-400">{copy}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default LandingPage;
