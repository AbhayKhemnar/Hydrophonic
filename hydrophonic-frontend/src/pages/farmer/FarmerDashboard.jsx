import StatCard from "../../components/common/StatCard";

function FarmerDashboard() {
  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[28px] border border-white/70 bg-emerald-950 p-6 text-white shadow-[0_30px_60px_-32px_rgba(6,78,59,0.6)] sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-300">Farmer Dashboard</p>
        <div className="mt-3 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div>
            <h2 className="text-3xl font-bold sm:text-4xl">Keep crop health, automation, and sales in sync.</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              Use the IoT section for live farm readings, AI for plant diagnosis, and Market to sell by
              fixed price or auction without leaving the dashboard.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
            {[
              ["Automation ready", "Pump and fogger rules available"],
              ["AI enabled", "Chat and image analysis in one place"],
              ["Marketplace live", "Direct selling and auction support"]
            ].map(([title, copy]) => (
              <div key={title} className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/10">
                <p className="font-semibold">{title}</p>
                <p className="mt-2 text-sm text-slate-300">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Farm Mode" value="Hybrid" hint="Manual + automation ready" tone="emerald" />
        <StatCard label="Marketplace" value="Live" hint="Fixed price and auction products" tone="sky" />
        <StatCard label="AI Assistant" value="Enabled" hint="Crop guidance and image analysis" tone="amber" />
      </div>
    </div>
  );
}

export default FarmerDashboard;
