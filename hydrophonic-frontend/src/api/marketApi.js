import client from "./client";

export const fetchProducts = (params) => client.get("/products", { params });
export const createProduct = (payload) => client.post("/products", payload);
export const fetchMyOrders = () => client.get("/orders/my");
export const placeBid = (payload) => client.post("/bids", payload);
export const fetchBidsByProduct = (productId) => client.get(`/bids/product/${productId}`);
export const createOrder = (payload) => client.post("/orders", payload);
