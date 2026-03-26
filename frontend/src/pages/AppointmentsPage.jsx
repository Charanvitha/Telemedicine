import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const defaultAvailability = [
  { dayOfWeek: 1, startTime: "09:00", endTime: "12:00", slotDurationMinutes: 30 },
  { dayOfWeek: 3, startTime: "14:00", endTime: "17:00", slotDurationMinutes: 30 }
];

const AppointmentsPage = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [availability, setAvailability] = useState(defaultAvailability);
  const [availabilityMessage, setAvailabilityMessage] = useState("");
  const [availabilityMessageType, setAvailabilityMessageType] = useState("success");
  const [prescriptionMessage, setPrescriptionMessage] = useState("");
  const [prescriptionMessageType, setPrescriptionMessageType] = useState("success");
  const [prescriptionForm, setPrescriptionForm] = useState({
    appointmentId: "",
    medicines: [{ name: "", dosage: "", frequency: "", duration: "" }],
    notes: ""
  });

  const loadAppointments = () => {
    api
      .get("/appointments")
      .then(({ data }) => setAppointments(data.appointments))
      .catch((error) => {
        console.error(error);
        setPrescriptionMessageType("error");
        setPrescriptionMessage("Could not load appointments.");
      });
  };

  const loadAvailability = () => {
    if (user.role !== "doctor") {
      return;
    }

    api
      .get(`/availability/${user._id}`)
      .then(({ data }) => {
        if (data.availability?.length) {
          setAvailability(data.availability);
        }
      })
      .catch((error) => {
        console.error(error);
        setAvailabilityMessageType("error");
        setAvailabilityMessage("Could not load saved availability.");
      });
  };

  useEffect(() => {
    loadAppointments();
    loadAvailability();
  }, []);

  const saveAvailability = async () => {
    try {
      setAvailabilityMessage("");

      await api.post("/availability", {
        slots: availability.map((slot) => ({
          dayOfWeek: Number(slot.dayOfWeek),
          startTime: slot.startTime,
          endTime: slot.endTime,
          slotDurationMinutes: Number(slot.slotDurationMinutes) || 30
        }))
      });

      loadAvailability();
      setAvailabilityMessageType("success");
      setAvailabilityMessage("Availability saved.");
    } catch (error) {
      console.error(error);
      setAvailabilityMessageType("error");
      setAvailabilityMessage(error.response?.data?.message || "Could not save availability.");
    }
  };

  const updateAppointmentStatus = async (id, status) => {
    try {
      await api.put(`/appointments/${id}/status`, { status });
      loadAppointments();
      setPrescriptionMessageType("success");
      setPrescriptionMessage("Appointment updated.");
    } catch (error) {
      console.error(error);
      setPrescriptionMessageType("error");
      setPrescriptionMessage(error.response?.data?.message || "Could not update appointment.");
    }
  };

  const createPrescription = async (event) => {
    event.preventDefault();

    if (!prescriptionForm.appointmentId) {
      setPrescriptionMessageType("error");
      setPrescriptionMessage("Please select an appointment before saving a prescription.");
      return;
    }

    try {
      await api.post("/prescriptions", prescriptionForm);
      setPrescriptionMessageType("success");
      setPrescriptionMessage("Prescription generated.");
      setPrescriptionForm({
        appointmentId: "",
        medicines: [{ name: "", dosage: "", frequency: "", duration: "" }],
        notes: ""
      });
    } catch (error) {
      console.error(error);
      setPrescriptionMessageType("error");
      setPrescriptionMessage(error.response?.data?.message || "Could not save prescription.");
    }
  };

  const updateAvailabilityField = (index, field, value) => {
    const next = [...availability];
    next[index][field] = value;
    setAvailability(next);
  };

  const updateMedicineField = (index, field, value) => {
    const next = [...prescriptionForm.medicines];
    next[index][field] = value;
    setPrescriptionForm({ ...prescriptionForm, medicines: next });
  };

  const doctorAppointments = appointments.filter((appointment) => appointment.patient?._id);

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
        <h1 className="text-3xl font-semibold text-white">Appointments</h1>
        <div className="mt-6 space-y-4">
          {appointments.map((appointment) => (
            <div key={appointment._id} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold text-white">
                    {user.role === "doctor" ? appointment.patient?.name : appointment.doctor?.name}
                  </p>
                  <p className="text-sm text-slate-400">{new Date(appointment.scheduledAt).toLocaleString()}</p>
                  <p className="mt-2 text-sm text-slate-500">{appointment.reason}</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-slate-800 px-3 py-1 text-sm capitalize">{appointment.status}</span>
                  <Link className="rounded-full bg-brand-600 px-4 py-2 text-sm text-white" to={`/video/${appointment.roomId}`}>
                    Join video
                  </Link>
                  {appointment.status !== "completed" ? (
                    <button
                      className="rounded-full border border-slate-700 px-4 py-2 text-sm"
                      type="button"
                      onClick={() => updateAppointmentStatus(appointment._id, "completed")}
                    >
                      Mark completed
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {user.role === "doctor" ? (
        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
            <h2 className="text-2xl font-semibold text-white">Set availability</h2>
            <div className="mt-4 space-y-4">
              {availability.map((slot, index) => (
                <div key={`${slot.dayOfWeek}-${index}`} className="grid gap-3 md:grid-cols-4">
                  <input
                    className="rounded-2xl border border-slate-700 bg-slate-950 px-3 py-2"
                    type="number"
                    min="0"
                    max="6"
                    value={slot.dayOfWeek}
                    onChange={(e) => updateAvailabilityField(index, "dayOfWeek", Number(e.target.value))}
                  />
                  <input
                    className="rounded-2xl border border-slate-700 bg-slate-950 px-3 py-2"
                    type="time"
                    value={slot.startTime}
                    onChange={(e) => updateAvailabilityField(index, "startTime", e.target.value)}
                  />
                  <input
                    className="rounded-2xl border border-slate-700 bg-slate-950 px-3 py-2"
                    type="time"
                    value={slot.endTime}
                    onChange={(e) => updateAvailabilityField(index, "endTime", e.target.value)}
                  />
                  <input
                    className="rounded-2xl border border-slate-700 bg-slate-950 px-3 py-2"
                    type="number"
                    value={slot.slotDurationMinutes}
                    onChange={(e) =>
                      updateAvailabilityField(index, "slotDurationMinutes", Number(e.target.value))
                    }
                  />
                </div>
              ))}
            </div>
            {availabilityMessage ? (
              <p
                className={`mt-4 text-sm ${
                  availabilityMessageType === "error" ? "text-rose-400" : "text-brand-100"
                }`}
              >
                {availabilityMessage}
              </p>
            ) : null}
            <button className="mt-4 rounded-2xl bg-brand-600 px-5 py-3 text-white" type="button" onClick={saveAvailability}>
              Save availability
            </button>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
            <h2 className="text-2xl font-semibold text-white">Issue prescription</h2>
            <form className="mt-4 space-y-4" onSubmit={createPrescription}>
              <select
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3"
                value={prescriptionForm.appointmentId}
                onChange={(e) => setPrescriptionForm({ ...prescriptionForm, appointmentId: e.target.value })}
              >
                <option value="">Select appointment</option>
                {doctorAppointments.map((appointment) => (
                  <option key={appointment._id} value={appointment._id}>
                    {appointment.patient?.name} - {new Date(appointment.scheduledAt).toLocaleString()}
                  </option>
                ))}
              </select>
              {!doctorAppointments.length ? (
                <p className="text-sm text-slate-400">
                  No doctor appointments available yet. Book an appointment with this doctor first.
                </p>
              ) : null}
              {prescriptionForm.medicines.map((medicine, index) => (
                <div key={index} className="grid gap-3 md:grid-cols-2">
                  <input
                    className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3"
                    placeholder="Medicine"
                    value={medicine.name}
                    onChange={(e) => updateMedicineField(index, "name", e.target.value)}
                  />
                  <input
                    className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3"
                    placeholder="Dosage"
                    value={medicine.dosage}
                    onChange={(e) => updateMedicineField(index, "dosage", e.target.value)}
                  />
                  <input
                    className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3"
                    placeholder="Frequency"
                    value={medicine.frequency}
                    onChange={(e) => updateMedicineField(index, "frequency", e.target.value)}
                  />
                  <input
                    className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3"
                    placeholder="Duration"
                    value={medicine.duration}
                    onChange={(e) => updateMedicineField(index, "duration", e.target.value)}
                  />
                </div>
              ))}
              <button
                className="rounded-full border border-slate-700 px-4 py-2"
                type="button"
                onClick={() =>
                  setPrescriptionForm({
                    ...prescriptionForm,
                    medicines: [
                      ...prescriptionForm.medicines,
                      { name: "", dosage: "", frequency: "", duration: "" }
                    ]
                  })
                }
              >
                Add medicine
              </button>
              <textarea
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3"
                rows="4"
                placeholder="Clinical notes"
                value={prescriptionForm.notes}
                onChange={(e) => setPrescriptionForm({ ...prescriptionForm, notes: e.target.value })}
              />
              {prescriptionMessage ? (
                <p
                  className={`text-sm ${
                    prescriptionMessageType === "error" ? "text-rose-400" : "text-brand-100"
                  }`}
                >
                  {prescriptionMessage}
                </p>
              ) : null}
              <button className="rounded-2xl bg-brand-600 px-5 py-3 text-white" type="submit">
                Save prescription
              </button>
            </form>
          </div>
        </section>
      ) : null}
    </div>
  );
};

export default AppointmentsPage;
