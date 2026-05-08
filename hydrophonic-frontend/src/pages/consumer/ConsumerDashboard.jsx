import StatCard from "../../components/common/StatCard";

function ConsumerDashboard() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <StatCard label="Nearby Farms" value="Location based" hint="Find farms around your area" tone="emerald" />
      <StatCard label="Per Kg Buying" value="Available" hint="Purchase direct from farmers" tone="sky" />
      <StatCard label="Support" value="Complaint page" hint="Raise issues when needed" tone="amber" />
    </div>
  );
}

export default ConsumerDashboard;
