import { Link } from "react-router-dom";
import heroImage from "../assets/hero.png";

function Home() {
  return (
    <div className="min-h-screen bg-transparent text-slate-950">
      <section className="mx-auto grid min-h-screen max-w-7xl items-center gap-10 px-4 py-10 sm:px-5 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-14">
        <div className="order-2 lg:order-1">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700">
            Hydroponic Farming Platform
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight text-slate-950 sm:text-5xl lg:text-6xl">
            Run your farm, sell produce, and get crop guidance from one clean dashboard.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
            Real-time IoT monitoring, automated decisions, direct marketplace access, and AI support
            built for hydroponic operations that need fast decisions and simple workflows.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/register"
              className="inline-flex items-center justify-center rounded-2xl bg-emerald-700 px-6 py-3.5 font-semibold text-white shadow-lg shadow-emerald-900/10 transition hover:bg-emerald-800"
            >
              Create Account
            </Link>
            <Link
              to="/market"
              className="inline-flex items-center justify-center rounded-2xl border border-white/70 bg-white/85 px-6 py-3.5 font-semibold text-slate-700 shadow-sm backdrop-blur transition hover:bg-white"
            >
              Explore Market
            </Link>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              ["Live Sensors", "pH, TDS, humidity, and water level on one screen"],
              ["Farmer Sales", "Direct per-kg sales and timed auctions for traders"],
              ["AI Support", "Plant image review and practical crop suggestions"]
            ].map(([title, copy]) => (
              <div
                key={title}
                className="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-[0_20px_45px_-28px_rgba(15,23,42,0.45)] backdrop-blur"
              >
                <p className="text-sm font-semibold text-slate-900">{title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-500">{copy}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <div className="overflow-hidden rounded-[28px] border border-white/70 bg-white/80 p-3 shadow-[0_35px_70px_-35px_rgba(15,23,42,0.55)] backdrop-blur">
            <img
              src={heroImage}
              alt="Hydroponic farming dashboard preview"
              className="h-[320px] w-full rounded-[22px] object-cover sm:h-[420px] lg:h-[540px]"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
