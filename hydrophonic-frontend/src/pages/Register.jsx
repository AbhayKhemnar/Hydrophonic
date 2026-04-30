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
    <div className="min-h-screen bg-slate-100 px-5 py-12">
      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-2xl rounded-lg border border-slate-200 bg-white p-8 shadow-sm"
      >
        <h1 className="text-3xl font-bold text-slate-950">Create account</h1>
        {error ? (
          <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <input
            className="rounded-lg border border-slate-300 px-3 py-2.5"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
          />
          <input
            className="rounded-lg border border-slate-300 px-3 py-2.5"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
          />
          <input
            className="rounded-lg border border-slate-300 px-3 py-2.5"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
          />
          <select
            className="rounded-lg border border-slate-300 px-3 py-2.5"
            value={form.role}
            onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))}
          >
            <option value="farmer">Farmer</option>
            <option value="trader">Trader</option>
            <option value="consumer">Local Consumer</option>
          </select>
          <input
            className="rounded-lg border border-slate-300 px-3 py-2.5"
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
            className="rounded-lg border border-slate-300 px-3 py-2.5"
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
            className="rounded-lg border border-slate-300 px-3 py-2.5"
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
            className="rounded-lg border border-slate-300 px-3 py-2.5"
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
        <button className="mt-6 rounded-lg bg-slate-950 px-5 py-2.5 font-semibold text-white">
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
