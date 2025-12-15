import { store } from "@/Redux/store";
import axios from "axios";


const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
  (config) => {
    const state = store.getState();
    console.log(state)
    const token = state.auth.accessToken; 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 and refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const state = store.getState();

    // Retry once
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = state.auth.refreshToken; 
      if (!refreshToken) {
        store.dispatch({ type: "auth/logout" });
        return Promise.reject(error);
      }

      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"}/user/refreshAccessToken`,
          { refreshToken },
          { headers: { "Content-Type": "application/json" } }
        );

        const newAccessToken = res.data.data;

        store.dispatch({
          type: "auth/loginSuccess",
          payload: { user: state.auth.user, accessToken: newAccessToken, refreshToken },
        });

        // Update headers
        api.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        // Retry original request
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed: logout
        store.dispatch({ type: "auth/logout" });
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
