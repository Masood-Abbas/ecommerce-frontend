import axios from "axios";
import { store } from "@/Redux/store";
import {  refreshTokenSuccess } from "@/Redux/authSlice/authSlice";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// REQUEST INTERCEPTOR
api.interceptors.request.use(
  (config) => {
    const { auth } = store.getState();
    const token = auth.accessToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const { auth } = store.getState();

    if (status === 401 && !originalRequest._retry) {
      if (!auth.refreshToken) {
        store.dispatch({ type: "auth/logout" });
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await axios.post(
          `${BASE_URL}/user/refreshAccessToken`,
          { refreshToken: auth.refreshToken },
          { headers: { "Content-Type": "application/json" } }
        );

        const { accessToken, refreshToken } = res.data;

        store.dispatch(
          refreshTokenSuccess({
            accessToken,
            refreshToken,
          })
        );

        api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        processQueue(null, accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        store.dispatch({ type: "auth/logout" });
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
