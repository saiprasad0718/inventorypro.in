import axios from "axios";

const api = axios.create({ baseURL: `${process.env.REACT_APP_BACKEND_URL}/api` });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("ip_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  config.headers["X-Outlet"] = localStorage.getItem("ip_outlet") || "Main Branch";
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && window.location.pathname.startsWith("/app")) {
      localStorage.removeItem("ip_token");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export function fmtErr(e) {
  const d = e?.response?.data?.detail;
  if (!d) return e?.message || "Something went wrong";
  if (typeof d === "string") return d;
  if (Array.isArray(d)) return d.map((x) => x?.msg || JSON.stringify(x)).filter(Boolean).join(" ");
  return d?.msg || String(d);
}

export default api;
