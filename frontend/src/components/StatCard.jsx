const StatCard = ({ label, value, helper }) => (
  <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl shadow-slate-950/20">
    <p className="text-sm text-slate-400">{label}</p>
    <p className="mt-2 text-3xl font-semibold text-white">{value}</p>
    {helper ? <p className="mt-2 text-sm text-slate-500">{helper}</p> : null}
  </div>
);

export default StatCard;
