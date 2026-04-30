import client from "./client";

export const sendChatMessage = (payload) => client.post("/ai/chat", payload);
export const analyzeImage = (formData) =>
  client.post("/ai/analyze-image", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
