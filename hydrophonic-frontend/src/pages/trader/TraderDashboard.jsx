import StatCard from "../../components/common/StatCard";

function TraderDashboard() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <StatCard label="Subscription" value="Pending / Active" hint="Request handled by admin" tone="sky" />
      <StatCard label="Auction Access" value="Enabled" hint="Place bids on farmer listings" tone="amber" />
      <StatCard label="Bulk Buying" value="Ready" hint="Buy directly from listed farms" tone="emerald" />
    </div>
  );
}

export default TraderDashboard;
