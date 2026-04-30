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
    <div className="min-h-screen bg-slate-100 px-5 py-12">
      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-md rounded-lg border border-slate-200 bg-white p-8 shadow-sm"
      >
        <h1 className="text-3xl font-bold text-slate-950">Login</h1>
        {error ? (
          <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}
        <input
          className="mt-6 w-full rounded-lg border border-slate-300 px-3 py-2.5"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="mt-4 w-full rounded-lg border border-slate-300 px-3 py-2.5"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="mt-6 w-full rounded-lg bg-slate-950 px-4 py-2.5 font-semibold text-white">
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
  );
}

export default Login;
