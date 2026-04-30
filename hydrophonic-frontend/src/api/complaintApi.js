import client from "./client";

export const submitComplaint = (payload) => client.post("/complaints", payload);
export const fetchMyComplaints = () => client.get("/complaints/my");
