import { useEffect, useState } from "react";
import api from "../services/api";

const PrescriptionsPage = () => {
  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
    api.get("/prescriptions").then(({ data }) => setPrescriptions(data.prescriptions)).catch(console.error);
  }, []);

  const assetBase = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api").replace(
    "/api",
    ""
  );

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
      <h1 className="text-3xl font-semibold text-white">Prescriptions</h1>
      <div className="mt-6 space-y-4">
        {prescriptions.map((item) => (
          <div key={item._id} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
            <p className="font-semibold text-white">
              {item.doctor?.name} to {item.patient?.name}
            </p>
            <p className="mt-1 text-sm text-slate-400">
              {item.appointment?.scheduledAt
                ? new Date(item.appointment.scheduledAt).toLocaleString()
                : "No appointment date"}
            </p>
            <div className="mt-4 space-y-3">
              {item.medicines.map((medicine, index) => (
                <div key={index} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300">
                  <p className="font-medium text-white">Medicine {index + 1}</p>
                  <p className="mt-2">Drug Name: {medicine.name}</p>
                  <p>Dose: {medicine.dosage}</p>
                  <p>Frequency: {medicine.frequency}</p>
                  <p>Duration: {medicine.duration}</p>
                </div>
              ))}
            </div>
            {item.pdfUrl ? (
              <a
                className="mt-4 inline-block text-brand-100"
                href={`${assetBase}${item.pdfUrl}`}
                target="_blank"
                rel="noreferrer"
              >
                Download PDF
              </a>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrescriptionsPage;
