import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
  headers: { "Content-Type": "application/json" },
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
// refresh the token
let isRefreshing = false;
let failedQueue = [];

// const processQueue = (error, token = null) => {
//   failedQueue.forEach((req) => {
//     if (error) req.reject(error);
//     else {
//       req.resolve(token);
//     }
//   });
//   failedQueue = [];
// };

// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       if (isRefreshing) {
//         return new Promise(function (resolve, reject) {
//           failedQueue.push({ resolve, reject });
//         })
//           .then((newToken) => {
//             originalRequest.headers["Authorization"] = "Bearer " + newToken;
//             return api(originalRequest);
//           })
//           .catch((err) => Promise.reject(err));
//       }

//       isRefreshing = true;

//       try {
//         const refreshToken = localStorage.getItem("refreshToken");

//         const res = await api.post(
//           `/user/refreshAccessToken`,
//           { refreshToken }
//         );

//         const newAccessToken = res.data.data.accessToken;
//         console.log(newAccessToken)
//         localStorage.setItem("accessToken", newAccessToken);

//         api.defaults.headers.common["Authorization"] =
//           "Bearer " + newAccessToken;

//         processQueue(null, newAccessToken);
//         isRefreshing = false;

//         originalRequest.headers["Authorization"] = "Bearer " + newAccessToken;
//         return api(originalRequest);
//       } catch (err) {
//         processQueue(err, null);
//         isRefreshing = false;

//         localStorage.removeItem("accessToken");
//         localStorage.removeItem("refreshToken");

//         return Promise.reject(err);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

export default api;
