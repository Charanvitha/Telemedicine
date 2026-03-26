import Navbar from "../components/Navbar";

const AppShell = ({ children }) => (
  <div className="min-h-screen">
    <Navbar />
    <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
  </div>
);

export default AppShell;
