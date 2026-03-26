import { useEffect, useState } from "react";
import api from "../services/api";

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const DoctorDirectoryPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [booking, setBooking] = useState({ scheduledDate: "", scheduledTime: "", reason: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.get("/users/doctors").then(({ data }) => setDoctors(data.doctors)).catch(console.error);
  }, []);

  const loadAvailability = async (doctor) => {
    setSelectedDoctor(doctor);
    setMessage("");
    const { data } = await api.get(`/availability/${doctor._id}`);
    setAvailability(data.availability);
  };

  const handleBook = async (event) => {
    event.preventDefault();

    if (!booking.scheduledDate || !booking.scheduledTime) {
      setMessage("Please choose both a date and a time.");
      return;
    }

    try {
      const scheduledAt = `${booking.scheduledDate}T${booking.scheduledTime}`;

      await api.post("/appointments", {
        doctorId: selectedDoctor._id,
        scheduledAt,
        reason: booking.reason
      });
      setMessage("Appointment booked successfully.");
      setBooking({ scheduledDate: "", scheduledTime: "", reason: "" });
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not book appointment.");
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
        <h1 className="text-3xl font-semibold text-white">Find a doctor</h1>
        <div className="mt-6 space-y-4">
          {doctors.map((doctor) => (
            <button
              key={doctor._id}
              type="button"
              onClick={() => loadAvailability(doctor)}
              className="w-full rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-left"
            >
              <p className="font-semibold text-white">{doctor.name}</p>
              <p className="text-sm text-slate-400">{doctor.specialization || "General Medicine"}</p>
              <p className="mt-2 text-sm text-slate-500">{doctor.bio}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
        <h2 className="text-2xl font-semibold text-white">
          {selectedDoctor ? `Book with ${selectedDoctor.name}` : "Select a doctor"}
        </h2>
        <div className="mt-4 space-y-3">
          {availability.map((slot) => (
            <div key={slot._id} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
              <p className="font-medium text-white">{dayNames[slot.dayOfWeek]}</p>
              <p className="text-sm text-slate-400">
                {slot.startTime} - {slot.endTime} ({slot.slotDurationMinutes} mins)
              </p>
            </div>
          ))}
        </div>
        {selectedDoctor ? (
          <form className="mt-6 space-y-4" onSubmit={handleBook}>
            <div className="grid gap-4 md:grid-cols-2">
              <input
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3"
                type="date"
                value={booking.scheduledDate}
                onChange={(e) => setBooking({ ...booking, scheduledDate: e.target.value })}
              />
              <input
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3"
                type="time"
                value={booking.scheduledTime}
                onChange={(e) => setBooking({ ...booking, scheduledTime: e.target.value })}
              />
            </div>
            <textarea
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3"
              rows="4"
              placeholder="Reason for consultation"
              value={booking.reason}
              onChange={(e) => setBooking({ ...booking, reason: e.target.value })}
            />
            {message ? <p className="text-sm text-brand-100">{message}</p> : null}
            <button className="rounded-2xl bg-brand-600 px-5 py-3 text-white" type="submit">
              Book appointment
            </button>
          </form>
        ) : null}
      </div>
    </div>
  );
};

export default DoctorDirectoryPage;
