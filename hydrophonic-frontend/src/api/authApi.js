import client from "./client";

export const loginRequest = (payload) => client.post("/auth/login", payload);
export const registerRequest = (payload) => client.post("/auth/register", payload);
export const fetchProfile = () => client.get("/auth/me");
export const updateProfile = (payload) => client.put("/auth/me", payload);
