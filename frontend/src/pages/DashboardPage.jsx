import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StatCard from "../components/StatCard";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const DashboardPage = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const load = async () => {
      const { data: apptData } = await api.get("/appointments");
      setAppointments(apptData.appointments);

      if (user.role === "admin") {
        const { data } = await api.get("/admin/analytics");
        setAnalytics(data.analytics);
      }
    };

    load().catch(console.error);
  }, [user.role]);

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-4xl font-semibold text-white">Welcome back, {user.name}</h1>
        <p className="mt-2 text-slate-400">
          {user.role === "patient" && "Manage bookings, records, and video consultations."}
          {user.role === "doctor" && "Review your schedule, set availability, and issue prescriptions."}
          {user.role === "admin" && "Monitor platform activity and manage users."}
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard label="Appointments" value={appointments.length} helper="Across your account scope" />
        <StatCard
          label="Upcoming"
          value={appointments.filter((item) => new Date(item.scheduledAt) > new Date()).length}
          helper="Future consultations"
        />
        <StatCard
          label="Completed"
          value={appointments.filter((item) => item.status === "completed").length}
          helper="Finished visits"
        />
      </section>

      {analytics ? (
        <section className="grid gap-4 md:grid-cols-4">
          <StatCard label="Users" value={analytics.totalUsers} />
          <StatCard label="Doctors" value={analytics.totalDoctors} />
          <StatCard label="Patients" value={analytics.totalPatients} />
          <StatCard label="Appointments" value={analytics.totalAppointments} />
        </section>
      ) : null}

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
          <h2 className="text-xl font-semibold text-white">Quick actions</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {user.role === "patient" ? (
              <Link className="rounded-full bg-brand-600 px-4 py-2 text-white" to="/doctors">
                Book a doctor
              </Link>
            ) : null}
            <Link className="rounded-full border border-slate-700 px-4 py-2" to="/appointments">
              View appointments
            </Link>
            <Link className="rounded-full border border-slate-700 px-4 py-2" to="/records">
              Medical records
            </Link>
            <Link className="rounded-full border border-slate-700 px-4 py-2" to="/prescriptions">
              Prescriptions
            </Link>
            {user.role === "admin" ? (
              <Link className="rounded-full border border-slate-700 px-4 py-2" to="/admin">
                Admin dashboard
              </Link>
            ) : null}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
          <h2 className="text-xl font-semibold text-white">Next consultations</h2>
          <div className="mt-4 space-y-3">
            {appointments.slice(0, 4).map((appointment) => (
              <div key={appointment._id} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                <p className="font-medium text-white">
                  {user.role === "doctor" ? appointment.patient?.name : appointment.doctor?.name}
                </p>
                <p className="text-sm text-slate-400">
                  {new Date(appointment.scheduledAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
