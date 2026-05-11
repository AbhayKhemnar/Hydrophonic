import { useEffect, useMemo, useState } from "react";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import {
  fetchAlerts,
  fetchLatestSensor,
  fetchMyDeviceCommands,
  fetchSensorHistory,
  queueDeviceCommand
} from "../../api/sensorApi";
import StatCard from "../../components/common/StatCard";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
  Filler
);

const lineOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top",
      labels: {
        boxWidth: 10,
        usePointStyle: true
      }
    }
  },
  scales: {
    x: {
      grid: { display: false }
    },
    y: {
      beginAtZero: false,
      grid: { color: "rgba(148, 163, 184, 0.18)" }
    }
  }
};

const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false }
  },
  scales: {
    x: { grid: { display: false } },
    y: { grid: { color: "rgba(148, 163, 184, 0.18)" } }
  }
};

function IoTDashboard() {
  const [sensor, setSensor] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [history, setHistory] = useState([]);
  const [commands, setCommands] = useState([]);
  const [commandMessage, setCommandMessage] = useState("");
  const [commandError, setCommandError] = useState("");
  const [activeSwitch, setActiveSwitch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const loadDashboard = async () => {
    const [latestResponse, alertsResponse, historyResponse, commandsResponse] = await Promise.all([
      fetchLatestSensor(),
      fetchAlerts(),
      fetchSensorHistory(),
      fetchMyDeviceCommands()
    ]);

    setSensor(latestResponse.data);
    setAlerts(alertsResponse.data);
    setHistory(Array.isArray(historyResponse.data) ? historyResponse.data : []);
    setCommands(Array.isArray(commandsResponse.data) ? commandsResponse.data : []);
  };

  useEffect(() => {
    const load = async () => {
      try {
        await loadDashboard();
      } catch {
        setSensor(null);
        setAlerts([]);
        setHistory([]);
        setCommands([]);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  const handleSwitch = async (device, action) => {
    setCommandMessage("");
    setCommandError("");
    setActiveSwitch(`${device}-${action}`);

    try {
      const response = await queueDeviceCommand({
        device,
        action,
        source: "manual",
        deviceId: "esp32-main"
      });

      setCommandMessage(response.data.message || "Command sent");
      const commandsResponse = await fetchMyDeviceCommands();
      setCommands(Array.isArray(commandsResponse.data) ? commandsResponse.data : []);
    } catch (error) {
      setCommandError(error.response?.data?.message || "Unable to send switch command");
    } finally {
      setActiveSwitch("");
    }
  };

  const chartHistory = useMemo(() => [...history].reverse().slice(-8), [history]);
  const labels = useMemo(
    () =>
      chartHistory.map((entry, index) =>
        entry?.createdAt
          ? new Date(entry.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          : `Sample ${index + 1}`
      ),
    [chartHistory]
  );

  const climateTrendData = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: "pH",
          data: chartHistory.map((entry) => entry.ph),
          borderColor: "#10b981",
          backgroundColor: "rgba(16, 185, 129, 0.14)",
          fill: true,
          tension: 0.35
        },
        {
          label: "Temperature",
          data: chartHistory.map((entry) => entry.temperature),
          borderColor: "#0f172a",
          backgroundColor: "rgba(15, 23, 42, 0.08)",
          fill: true,
          tension: 0.35
        }
      ]
    }),
    [chartHistory, labels]
  );

  const nutrientBalanceData = useMemo(
    () => ({
      labels,
      datasets: [
        {
          data: chartHistory.map((entry) => entry.tds),
          backgroundColor: ["#0ea5e9", "#22c55e", "#f59e0b", "#38bdf8", "#14b8a6", "#8b5cf6", "#f97316", "#10b981"]
        }
      ]
    }),
    [chartHistory, labels]
  );

  const systemHealth = [
    {
      label: "Pump readiness",
      value: sensor?.waterLevel > 30 ? "Stable" : "Needs refill soon",
      tone: sensor?.waterLevel > 30 ? "emerald" : "amber"
    },
    {
      label: "Climate response",
      value: sensor?.temperature > 30 ? "Fogger attention" : "Within range",
      tone: sensor?.temperature > 30 ? "rose" : "sky"
    },
    {
      label: "Nutrient strength",
      value: sensor?.tds ? `${sensor.tds} ppm` : "No reading",
      tone: "amber"
    }
  ];

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-[0_30px_60px_-32px_rgba(15,23,42,0.45)] backdrop-blur sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-600">IoT Control Center</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-950">Live farm conditions and alerts</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
              Watch the latest readings, scan recent trends, and spot automation issues before they hit
              crop quality.
            </p>
          </div>
          <div className="rounded-2xl bg-emerald-900 px-4 py-3 text-sm font-semibold text-white">
            {isLoading ? "Loading sensor feed..." : `${history.length || 0} readings tracked`}
          </div>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="pH" value={sensor?.ph ?? "--"} tone="emerald" hint="Acidity balance" />
        <StatCard label="TDS" value={sensor?.tds ?? "--"} tone="sky" hint="Nutrient strength" />
        <StatCard label="Temperature" value={sensor?.temperature ?? "--"} tone="amber" hint="Air or solution heat" />
        <StatCard label="Humidity" value={sensor?.humidity ?? "--"} tone="slate" hint="Ambient moisture" />
        <StatCard label="Water Level" value={sensor?.waterLevel ?? "--"} tone="rose" hint="Reservoir status" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-[28px] border border-white/70 bg-white/90 p-5 shadow-[0_30px_60px_-32px_rgba(15,23,42,0.45)] backdrop-blur sm:p-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">Trend Chart</p>
            <h3 className="mt-1 text-xl font-bold text-slate-950">pH and temperature movement</h3>
          </div>
          <div className="mt-6 h-80">
            {chartHistory.length > 0 ? (
              <Line data={climateTrendData} options={lineOptions} />
            ) : (
              <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-500">
                No sensor history available yet.
              </div>
            )}
          </div>
        </section>

        <section className="rounded-[28px] border border-white/70 bg-white/90 p-5 shadow-[0_30px_60px_-32px_rgba(15,23,42,0.45)] backdrop-blur sm:p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-lime-700">Snapshot</p>
          <h3 className="mt-1 text-xl font-bold text-slate-950">Nutrient trend</h3>
          <div className="mt-6 h-80">
            {chartHistory.length > 0 ? (
              <Bar data={nutrientBalanceData} options={barOptions} />
            ) : (
              <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-500">
                Waiting for TDS history.
              </div>
            )}
          </div>
        </section>
      </div>

      <section className="grid gap-4 lg:grid-cols-3">
        {systemHealth.map((item) => (
          <StatCard key={item.label} label={item.label} value={item.value} tone={item.tone} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[28px] border border-white/70 bg-white/90 p-5 shadow-[0_30px_60px_-32px_rgba(15,23,42,0.45)] backdrop-blur sm:p-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">Relay Control</p>
            <h3 className="mt-1 text-xl font-bold text-slate-950">Switch hardware from farmer login</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Relay 1 and Relay 2 commands are queued for your ESP32. The hardware can poll the backend
              and execute the latest pending command.
            </p>
          </div>

          {commandMessage ? (
            <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {commandMessage}
            </div>
          ) : null}

          {commandError ? (
            <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {commandError}
            </div>
          ) : null}

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {[
              { device: "relay1", title: "Relay 1", hint: "Pump / water motor" },
              { device: "relay2", title: "Relay 2", hint: "Fogger / fan / light" }
            ].map((relay) => (
              <div key={relay.device} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                <p className="text-lg font-semibold text-slate-900">{relay.title}</p>
                <p className="mt-1 text-sm text-slate-500">{relay.hint}</p>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleSwitch(relay.device, "ON")}
                    disabled={activeSwitch === `${relay.device}-ON`}
                    className="rounded-2xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-emerald-300"
                  >
                    {activeSwitch === `${relay.device}-ON` ? "Sending..." : "Turn ON"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSwitch(relay.device, "OFF")}
                    disabled={activeSwitch === `${relay.device}-OFF`}
                    className="rounded-2xl bg-slate-200 px-4 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-300 disabled:cursor-not-allowed disabled:bg-slate-100"
                  >
                    {activeSwitch === `${relay.device}-OFF` ? "Sending..." : "Turn OFF"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-white/70 bg-white/90 p-5 shadow-[0_30px_60px_-32px_rgba(15,23,42,0.45)] backdrop-blur sm:p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">Command Log</p>
              <h3 className="mt-1 text-xl font-bold text-slate-950">Recent relay commands</h3>
            </div>
            <span className="inline-flex w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase text-slate-600">
              {commands.length} commands
            </span>
          </div>

          <div className="mt-5 space-y-3">
            {commands.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-500">
                No relay commands sent yet.
              </div>
            ) : (
              commands.map((command) => (
                <div
                  key={command._id}
                  className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 text-sm"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-semibold text-slate-900">
                        {command.device} → {command.action}
                      </p>
                      <p className="mt-1 text-slate-500">
                        {command.createdAt ? new Date(command.createdAt).toLocaleString() : "Recent"}
                      </p>
                    </div>
                    <span
                      className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold uppercase ${
                        command.status === "executed"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {command.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="rounded-[28px] border border-white/70 bg-white/90 p-5 shadow-[0_30px_60px_-32px_rgba(15,23,42,0.45)] backdrop-blur sm:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-800">Alerts</p>
            <h3 className="mt-1 text-xl font-bold text-slate-950">Recent system notifications</h3>
          </div>
          <span className="inline-flex w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase text-slate-600">
            {alerts.length} active
          </span>
        </div>

        <div className="mt-5 grid gap-3">
          {alerts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-500">
              No alerts right now. Your latest reading looks calm.
            </div>
          ) : (
            alerts.map((alert) => (
              <div
                key={alert._id}
                className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 text-sm text-slate-700"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="font-semibold text-slate-900">{alert.type || "Alert"}</p>
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    {alert.createdAt ? new Date(alert.createdAt).toLocaleString() : "Recent"}
                  </span>
                </div>
                <p className="mt-2 leading-6">{alert.message}</p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

export default IoTDashboard;
