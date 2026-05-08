import { useEffect, useState } from "react";
import { fetchMarketplaceOverview, fetchUsers } from "../../api/adminApi";
import StatCard from "../../components/common/StatCard";

const roleOptions = [
  { value: "farmer", label: "Farmers" },
  { value: "trader", label: "Traders" },
  { value: "consumer", label: "Local Consumers" }
];

function UserTable({ title, users }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-lg font-bold text-slate-950">{title}</h3>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase text-slate-600">
          {users.length}
        </span>
      </div>

      {users.length === 0 ? (
        <div className="mt-4 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
          No users in this role yet.
        </div>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="py-3 pr-4 font-semibold">Name</th>
                <th className="py-3 pr-4 font-semibold">Email</th>
                <th className="py-3 pr-4 font-semibold">District</th>
                <th className="py-3 font-semibold">Phone</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b border-slate-100 last:border-b-0">
                  <td className="py-3 pr-4 font-medium text-slate-900">{user.name}</td>
                  <td className="py-3 pr-4 text-slate-600">{user.email}</td>
                  <td className="py-3 pr-4 text-slate-600">{user.location?.district || "--"}</td>
                  <td className="py-3 text-slate-600">{user.contact?.phone || "--"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function AdminDashboard() {
  const [overview, setOverview] = useState({});
  const [users, setUsers] = useState([]);
  const [selectedRole, setSelectedRole] = useState("farmer");

  useEffect(() => {
    fetchMarketplaceOverview().then((response) => setOverview(response.data)).catch(() => setOverview({}));
    fetchUsers().then((response) => setUsers(response.data)).catch(() => setUsers([]));
  }, []);

  const filteredUsers = users.filter((user) => user.role === selectedRole);
  const activeRole = roleOptions.find((role) => role.value === selectedRole);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Products" value={overview.products ?? 0} />
        <StatCard label="Bids" value={overview.bids ?? 0} />
        <StatCard label="Orders" value={overview.orders ?? 0} />
        <StatCard label="Open Complaints" value={overview.openComplaints ?? 0} />
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">User Directory</p>
            <h3 className="mt-1 text-xl font-bold text-slate-950">View users by role</h3>
          </div>

          <select
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm font-medium text-slate-700 sm:w-56"
            value={selectedRole}
            onChange={(event) => setSelectedRole(event.target.value)}
          >
            {roleOptions.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-6">
          <UserTable title={activeRole?.label || "Users"} users={filteredUsers} />
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
