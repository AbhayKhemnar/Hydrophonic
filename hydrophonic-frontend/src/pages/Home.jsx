import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-950">
      <section className="mx-auto max-w-6xl px-5 py-16 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
          Hydroponic Farming Platform
        </p>
        <h1 className="mt-4 text-4xl font-bold sm:text-5xl">
          Smart farming, direct selling, and AI support in one place.
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
          Monitor sensor data, automate irrigation, analyze crop images, and connect farmers with
          traders and local consumers.
        </p>
        <div className="mt-8 flex gap-4">
          <Link to="/register" className="rounded-lg bg-emerald-600 px-5 py-3 font-semibold text-white">
            Get Started
          </Link>
          <Link to="/market" className="rounded-lg border border-slate-300 px-5 py-3 font-semibold text-slate-700">
            Explore Market
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
