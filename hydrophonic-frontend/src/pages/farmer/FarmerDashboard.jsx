import StatCard from "../../components/common/StatCard";

function FarmerDashboard() {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Farm Mode" value="Hybrid" hint="Manual + automation ready" />
        <StatCard label="Marketplace" value="Live" hint="Fixed price and auction products" />
        <StatCard label="AI Assistant" value="Enabled" hint="Crop guidance and image analysis" />
      </div>
    </>
  );
}

export default FarmerDashboard;
