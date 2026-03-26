import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link to="/" className="text-xl font-semibold text-white">
          Telemedicine
        </Link>
        <nav className="flex items-center gap-4 text-sm text-slate-300">
          {user ? (
            <>
              <NavLink to="/dashboard">Dashboard</NavLink>
              <NavLink to="/appointments">Appointments</NavLink>
              <NavLink to="/video/demo-room">Video</NavLink>
              <button
                type="button"
                onClick={logout}
                className="rounded-full bg-brand-600 px-4 py-2 text-white"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register">Register</NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
