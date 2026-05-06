import axios from "axios";
import toast from "react-hot-toast";
import { API_BASE_URL } from "@/utils/constants";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // Sudah ditingkatkan dari 10000
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor untuk menambahkan token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Avoid stale authenticated data from browser/proxy caches.
    config.headers["Cache-Control"] = "no-cache, no-store, must-revalidate";
    config.headers.Pragma = "no-cache";

    // Add logging untuk development
    if (import.meta.env.VITE_ENABLE_ROUTER_LOGGING === "true") {
      console.log(
        `🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`
      );
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor untuk error handling
api.interceptors.response.use(
  (response) => {
    // Add logging untuk development
    if (import.meta.env.VITE_ENABLE_ROUTER_LOGGING === "true") {
      console.log(
        `✅ API Response: ${response.config.method?.toUpperCase()} ${
          response.config.url
        } - ${response.status}`
      );
    }

    // Return only data from response
    return response.data;
  },
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Terjadi kesalahan yang tidak diketahui";

    // Add logging untuk development
    if (import.meta.env.VITE_ENABLE_ROUTER_LOGGING === "true") {
      console.error(
        `❌ API Error: ${error.config?.method?.toUpperCase()} ${
          error.config?.url
        } - ${error.response?.status}`,
        error
      );
    }

    // Handle specific error codes
    switch (error.response?.status) {
      case 401:
        // Unauthorized - redirect to login
        localStorage.removeItem("token");
        if (
          window.location.pathname !== "/auth/login" &&
          window.location.pathname !== "/login"
        ) {
          toast.error("Sesi Anda telah berakhir. Silakan login kembali.");
          window.location.href = "/auth/login";
        }
        break;
      case 403:
        toast.error("Anda tidak memiliki akses untuk melakukan tindakan ini");
        break;
      case 404:
        toast.error("Data tidak ditemukan");
        break;
      case 422:
        // Validation errors
        if (error.response.data?.errors) {
          const errors = Object.values(error.response.data.errors).flat();
          errors.forEach((err) => toast.error(err));
        } else {
          toast.error(message);
        }
        break;
      case 429:
        toast.error("Terlalu banyak permintaan. Silakan coba lagi nanti.");
        break;
      case 500:
        toast.error("Terjadi kesalahan server. Silakan coba lagi.");
        break;
      default:
        if (error.response?.status >= 400) {
          toast.error(message);
        }
    }

    return Promise.reject(error);
  }
);

export default api;
