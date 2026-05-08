import client from "./client";

export const fetchLatestSensor = () => client.get("/sensor/latest");
export const fetchSensorHistory = () => client.get("/sensor/history");
export const fetchAlerts = () => client.get("/sensor/alerts");
export const fetchRules = () => client.get("/rules");
export const createRule = (payload) => client.post("/rules", payload);
export const manualControl = (payload) => client.post("/rules/manual-control", payload);
