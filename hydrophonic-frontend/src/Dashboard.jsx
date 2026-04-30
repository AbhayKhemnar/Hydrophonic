import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
} from "chart.js";
import AIAssistant from "./components/AIAssistant";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const API_BASE = "http://localhost:5000/api";
const SENSOR_URL = `${API_BASE}/sensor/sensor-data`;
const CONTROL_URL = `${API_BASE}/sensor/control`;

const formatValue = (value, suffix = "") => {
  if (value === undefined || value === null || value === "") return "--";
  return `${value}${suffix}`;
};

function MetricCard({ label, value, detail, accent }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-3 text-3xl font-bold text-slate-950">{value}</p>
        </div>
        <span className={`h-3 w-3 rounded-full ${accent}`} />
      </div>
      <p className="mt-4 text-sm text-slate-500">{detail}</p>
    </div>
  );
}

function Dashboard({ onLogout }) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState("System ready");

  const fetchData = async () => {
    try {
      const res = await axios.get(SENSOR_URL);
      setData(res.data);
      setStatusMessage("Live data synced");
    } catch (err) {
      console.error(err);
      setStatusMessage("Unable to sync sensor data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const latest = data[0] || {};
  const lastUpdated = latest.createdAt
    ? new Date(latest.createdAt).toLocaleString()
    : "Waiting for first reading";

  const controlDevice = async (device, status) => {
    try {
      await axios.post(CONTROL_URL, { device, status });
      setStatusMessage(`${device.toUpperCase()} turned ${status}`);
    } catch (err) {
      console.error(err);
      setStatusMessage("Failed to send device command");
    }
  };

  const chartData = useMemo(() => ({
    labels: data.map((d) => new Date(d.createdAt).toLocaleTimeString()).reverse(),
    datasets: [
      {
        label: "Temperature (C)",
        data: data.map((d) => d.temperature).reverse(),
        borderColor: "rgb(239, 68, 68)",
        backgroundColor: "rgba(239, 68, 68, 0.12)",
        tension: 0.35
      },
      {
        label: "pH",
        data: data.map((d) => d.ph).reverse(),
        borderColor: "rgb(14, 165, 233)",
        backgroundColor: "rgba(14, 165, 233, 0.12)",
        tension: 0.35
      },
      {
        label: "TDS",
        data: data.map((d) => d.tds).reverse(),
        borderColor: "rgb(34, 197, 94)",
        backgroundColor: "rgba(34, 197, 94, 0.12)",
        tension: 0.35
      },
      {
        label: "Water Level",
        data: data.map((d) => d.waterLevel).reverse(),
        borderColor: "rgb(245, 158, 11)",
        backgroundColor: "rgba(245, 158, 11, 0.12)",
        tension: 0.35
      }
    ]
  }), [data]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          boxWidth: 12,
          color: "#475569"
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#64748b" }
      },
      y: {
        grid: { color: "#e2e8f0" },
        ticks: { color: "#64748b" }
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
              Hydroponic Monitoring
            </p>
            <h1 className="mt-1 text-2xl font-bold text-slate-950 sm:text-3xl">
              Smart Farm Dashboard
            </h1>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-red-300 hover:bg-red-50 hover:text-red-700"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-6 lg:px-8">
        <section className="mb-6 rounded-lg bg-slate-950 p-5 text-white shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm text-slate-300">Current system status</p>
              <h2 className="mt-1 text-xl font-semibold">{statusMessage}</h2>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/10 px-4 py-3">
              <p className="text-xs uppercase tracking-wide text-slate-300">Last update</p>
              <p className="mt-1 text-sm font-medium">{isLoading ? "Loading..." : lastUpdated}</p>
            </div>
          </div>
        </section>

        <section className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Temperature"
            value={formatValue(latest.temperature, " C")}
            detail="Nutrient solution temperature"
            accent="bg-red-500"
          />
          <MetricCard
            label="pH Level"
            value={formatValue(latest.ph)}
            detail="Acidity balance"
            accent="bg-sky-500"
          />
          <MetricCard
            label="TDS"
            value={formatValue(latest.tds, " ppm")}
            detail="Nutrient concentration"
            accent="bg-emerald-500"
          />
          <MetricCard
            label="Water Level"
            value={formatValue(latest.waterLevel, " %")}
            detail="Reservoir availability"
            accent="bg-amber-500"
          />
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[360px_1fr]">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5">
              <h2 className="text-lg font-bold text-slate-950">Device Control</h2>
              <p className="mt-1 text-sm text-slate-500">Send relay commands to farm devices.</p>
            </div>

            <div className="space-y-5">
              <div>
                <p className="mb-2 text-sm font-semibold text-slate-700">Pump</p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => controlDevice("pump", "ON")}
                    className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                  >
                    ON
                  </button>
                  <button
                    type="button"
                    onClick={() => controlDevice("pump", "OFF")}
                    className="rounded-lg bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-300"
                  >
                    OFF
                  </button>
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-semibold text-slate-700">Fogger</p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => controlDevice("fogger", "ON")}
                    className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700"
                  >
                    ON
                  </button>
                  <button
                    type="button"
                    onClick={() => controlDevice("fogger", "OFF")}
                    className="rounded-lg bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-300"
                  >
                    OFF
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-950">Sensor Trends</h2>
                <p className="mt-1 text-sm text-slate-500">Auto-refreshes every 5 seconds.</p>
              </div>
              <span className="rounded-lg bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
                {data.length} readings
              </span>
            </div>
            <div className="h-[360px]">
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>
        </section>

        <AIAssistant />
      </main>
    </div>
  );
}

export default Dashboard;
