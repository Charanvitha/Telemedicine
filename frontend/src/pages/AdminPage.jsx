import { useEffect, useState } from "react";
import StatCard from "../components/StatCard";
import api from "../services/api";

const AdminPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);

  const load = async () => {
    const [{ data: analyticsData }, { data: usersData }] = await Promise.all([
      api.get("/admin/analytics"),
      api.get("/admin/users")
    ]);
    setAnalytics(analyticsData.analytics);
    setUsers(usersData.users);
  };

  useEffect(() => {
    load().catch(console.error);
  }, []);

  const removeUser = async (id) => {
    await api.delete(`/admin/users/${id}`);
    load();
  };

  if (!analytics) {
    return <p>Loading admin dashboard...</p>;
  }

  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-4">
        <StatCard label="Total users" value={analytics.totalUsers} />
        <StatCard label="Doctors" value={analytics.totalDoctors} />
        <StatCard label="Patients" value={analytics.totalPatients} />
        <StatCard label="Appointments" value={analytics.totalAppointments} />
      </section>

      <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
        <h1 className="text-3xl font-semibold text-white">User management</h1>
        <div className="mt-6 space-y-4">
          {users.map((currentUser) => (
            <div
              key={currentUser._id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-950/60 p-4"
            >
              <div>
                <p className="font-semibold text-white">{currentUser.name}</p>
                <p className="text-sm text-slate-400">
                  {currentUser.email} | {currentUser.role}
                </p>
              </div>
              <button
                className="rounded-full border border-rose-500/50 px-4 py-2 text-sm text-rose-300"
                type="button"
                onClick={() => removeUser(currentUser._id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminPage;
