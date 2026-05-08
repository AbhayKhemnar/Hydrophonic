import client from "./client";

export const fetchUsers = (role) => client.get("/admin/users", { params: role ? { role } : {} });
export const fetchAdminComplaints = () => client.get("/admin/complaints");
export const updateAdminComplaint = (id, payload) => client.put(`/admin/complaints/${id}`, payload);
export const fetchSubscriptions = () => client.get("/admin/subscriptions");
export const fetchMarketplaceOverview = () => client.get("/admin/marketplace-overview");
