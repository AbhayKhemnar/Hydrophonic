import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "farmer",
    location: { state: "", district: "", village: "" },
    contact: { phone: "" }
  });
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const user = await register(form);
      navigate(`/${user.role}/dashboard`);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to register");
    }
  };

  return (
    <div className="min-h-screen bg-transparent px-4 py-8 sm:px-5 lg:px-8">
      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-4xl rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-[0_30px_60px_-32px_rgba(15,23,42,0.45)] backdrop-blur sm:p-8"
      >
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700">Get started</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950 sm:text-4xl">Create account</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
          Set up your profile once and the platform will route you to the right workspace for farming,
          trading, or local buying.
        </p>
        {error ? (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <input
            className="rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
          />
          <input
            className="rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
          />
          <input
            className="rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
          />
          <select
            className="rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            value={form.role}
            onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))}
          >
            <option value="farmer">Farmer</option>
            <option value="trader">Trader</option>
            <option value="consumer">Local Consumer</option>
          </select>
          <input
            className="rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            placeholder="State"
            value={form.location.state}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                location: { ...prev.location, state: e.target.value }
              }))
            }
          />
          <input
            className="rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            placeholder="District"
            value={form.location.district}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                location: { ...prev.location, district: e.target.value }
              }))
            }
          />
          <input
            className="rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            placeholder="Village"
            value={form.location.village}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                location: { ...prev.location, village: e.target.value }
              }))
            }
          />
          <input
            className="rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            placeholder="Phone"
            value={form.contact.phone}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                contact: { ...prev.contact, phone: e.target.value }
              }))
            }
          />
        </div>
        <button className="mt-6 rounded-2xl bg-emerald-700 px-6 py-3 font-semibold text-white transition hover:bg-emerald-800">
          Register
        </button>
        <p className="mt-4 text-sm text-slate-600">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-emerald-700">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
