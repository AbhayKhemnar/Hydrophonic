import StatCard from "../../components/common/StatCard";

function ConsumerDashboard() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <StatCard label="Nearby Farms" value="Location based" hint="Find farms around your area" />
      <StatCard label="Per Kg Buying" value="Available" hint="Purchase direct from farmers" />
      <StatCard label="Support" value="Complaint page" hint="Raise issues when needed" />
    </div>
  );
}

export default ConsumerDashboard;
