import { useEffect, useState } from "react";
import { fetchAlerts, fetchLatestSensor } from "../../api/sensorApi";
import StatCard from "../../components/common/StatCard";

function IoTDashboard() {
  const [sensor, setSensor] = useState(null);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    fetchLatestSensor().then((response) => setSensor(response.data)).catch(() => setSensor(null));
    fetchAlerts().then((response) => setAlerts(response.data)).catch(() => setAlerts([]));
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard label="pH" value={sensor?.ph ?? "--"} />
        <StatCard label="TDS" value={sensor?.tds ?? "--"} />
        <StatCard label="Temperature" value={sensor?.temperature ?? "--"} />
        <StatCard label="Humidity" value={sensor?.humidity ?? "--"} />
        <StatCard label="Water Level" value={sensor?.waterLevel ?? "--"} />
      </div>
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-bold text-slate-950">Alerts</h3>
        <div className="mt-4 space-y-3">
          {alerts.map((alert) => (
            <div key={alert._id} className="rounded-lg border border-slate-200 p-4 text-sm text-slate-700">
              {alert.message}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default IoTDashboard;
