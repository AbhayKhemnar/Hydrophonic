import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const user = await login({ email, password });
      navigate(`/${user.role}/dashboard`);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to login");
    }
  };

  return (
    <div className="min-h-screen bg-transparent px-4 py-8 sm:px-5 lg:px-8">
      <div className="mx-auto grid max-w-6xl items-center gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[28px] border border-white/70 bg-emerald-950 p-8 text-white shadow-[0_30px_60px_-32px_rgba(6,78,59,0.6)] sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-300">
            Welcome back
          </p>
          <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl">
            Sign in to manage your hydroponic operations.
          </h1>
          <p className="mt-5 max-w-lg text-sm leading-7 text-slate-300 sm:text-base">
            Check sensor performance, review alerts, list produce, and respond to market activity from
            one place.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-[0_30px_60px_-32px_rgba(15,23,42,0.45)] backdrop-blur sm:p-8"
        >
          <h2 className="text-3xl font-bold text-slate-950">Login</h2>
          {error ? (
            <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}
          <div className="mt-6 space-y-4">
            <input
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="mt-6 w-full rounded-2xl bg-emerald-700 px-4 py-3 font-semibold text-white transition hover:bg-emerald-800">
            Login
          </button>
          <p className="mt-4 text-sm text-slate-600">
            New user?{" "}
            <Link to="/register" className="font-semibold text-emerald-700">
              Create account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
