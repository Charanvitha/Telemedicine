import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const RecordsPage = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", type: "report", file: null });

  const load = () => {
    const endpoint = user.role === "patient" ? "/records/me" : "/records";
    api.get(endpoint).then(({ data }) => setRecords(data.records)).catch(console.error);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData();
    data.append("title", form.title);
    data.append("description", form.description);
    data.append("type", form.type);
    if (form.file) {
      data.append("file", form.file);
    }
    await api.post("/records", data);
    setForm({ title: "", description: "", type: "report", file: null });
    load();
  };

  const assetBase = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api").replace(
    "/api",
    ""
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      {user.role === "patient" ? (
        <form className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6" onSubmit={handleSubmit}>
          <h1 className="text-2xl font-semibold text-white">Upload medical record</h1>
          <div className="mt-4 space-y-4">
            <input
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3"
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <textarea
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3"
              rows="4"
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <select
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              <option value="report">Report</option>
              <option value="history">History</option>
            </select>
            <input
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3"
              type="file"
              onChange={(e) => setForm({ ...form, file: e.target.files?.[0] || null })}
            />
            <button className="rounded-2xl bg-brand-600 px-5 py-3 text-white" type="submit">
              Save record
            </button>
          </div>
        </form>
      ) : (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
          <h1 className="text-2xl font-semibold text-white">Medical records</h1>
          <p className="mt-4 text-slate-400">
            Clinicians and admins can review uploaded patient records here. Patient self-upload is
            available from patient accounts.
          </p>
        </div>
      )}

      <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
        <h2 className="text-2xl font-semibold text-white">Record history</h2>
        <div className="mt-4 space-y-4">
          {records.map((record) => (
            <div key={record._id} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
              <p className="font-medium text-white">{record.title}</p>
              {record.patient?.name ? (
                <p className="mt-1 text-sm text-slate-500">Patient: {record.patient.name}</p>
              ) : null}
              <p className="mt-1 text-sm text-slate-400">{record.description}</p>
              <p className="mt-2 text-xs uppercase tracking-wide text-slate-500">{record.type}</p>
              {record.fileUrl ? (
                <a
                  className="mt-3 inline-block text-sm text-brand-100"
                  href={`${assetBase}${record.fileUrl}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  View attachment
                </a>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecordsPage;
