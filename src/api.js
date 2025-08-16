import axios from "axios";
export const API_BASE =
  import.meta.env.VITE_API_BASE ||
  "https://social-blog-server-6g7j.onrender.com";
export const api = axios.create({ baseURL: API_BASE + "/api" });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
