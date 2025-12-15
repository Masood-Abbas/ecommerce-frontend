import axios from "axios";
import { useNavigate } from "react-router-dom"; // Optional: for redirect to login

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
  headers: { "Content-Type": "application/json" },
});

// Request interceptor to attach access token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only retry once
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log("token")
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");
      console.log("refreshToken",refreshToken)


      if (!refreshToken) {
        // Tokens missing, clear storage and optionally redirect
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        // window.location.href = "/login"; // uncomment to redirect
        return Promise.reject(error);
      }

      try {
        // Call refresh token endpoint
        const res = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"}/user/refreshAccessToken`,
          { refreshToken },
          { headers: { "Content-Type": "application/json" } }
        );

        const newAccessToken = res.data.data;
        console.log("newAccessToken",newAccessToken)

        // Save new access token
        localStorage.setItem("accessToken", newAccessToken);

        // Update headers
        api.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        // Retry original request
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed: clear storage and optionally redirect
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        // window.location.href = "/login"; // uncomment to redirect
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
