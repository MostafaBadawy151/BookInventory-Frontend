import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL || "https://localhost:7097";

const api = axios.create({
  baseURL: apiUrl,
  headers: { "Content-Type": "application/json" },
});

export function setAuthHeader(token: string | null) {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
}

api.interceptors.response.use(
  (r) => r,
  (error) => {
    // bubble up for AuthContext to catch
    return Promise.reject(error);
  }
);

export default api;
