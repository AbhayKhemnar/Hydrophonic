function StatCard({ label, value, hint, tone = "slate" }) {
  const toneMap = {
    emerald: "bg-emerald-50 text-emerald-800 ring-emerald-100",
    sky: "bg-lime-50 text-lime-800 ring-lime-100",
    amber: "bg-green-50 text-green-800 ring-green-100",
    rose: "bg-teal-50 text-teal-800 ring-teal-100",
    slate: "bg-slate-100 text-slate-700 ring-slate-200"
  };

  return (
    <div className="rounded-2xl border border-white/70 bg-white/90 p-5 shadow-[0_20px_45px_-28px_rgba(15,23,42,0.45)] backdrop-blur">
      <span
        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ring-1 ${toneMap[tone] || toneMap.slate}`}
      >
        {label}
      </span>
      <p className="mt-4 text-3xl font-bold text-slate-950 sm:text-4xl">{value}</p>
      {hint ? <p className="mt-2 text-sm text-slate-500">{hint}</p> : null}
    </div>
  );
}

export default StatCard;
