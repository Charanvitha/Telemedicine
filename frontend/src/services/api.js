import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"
});

api.interceptors.request.use((config) => {
  const auth = localStorage.getItem("telemed_auth");
  if (auth) {
    const { token } = JSON.parse(auth);
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
