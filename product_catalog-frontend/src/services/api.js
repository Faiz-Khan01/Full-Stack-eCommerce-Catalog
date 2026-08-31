import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://full-stack-ecommerce-catalog.onrender.com/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically attach JWT token to every request if available
api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("jwtToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Automatically handle 401 / 403 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      (error.response.status === 401 ||
        error.response.status === 403)
    ) {
      const hadToken =
        localStorage.getItem("token") ||
        localStorage.getItem("jwtToken");

      if (hadToken) {
        localStorage.removeItem("token");
        localStorage.removeItem("jwtToken");
        localStorage.removeItem("user");
        window.dispatchEvent(new Event("storage"));
      }
    }

    return Promise.reject(error);
  }
);

export default api;
