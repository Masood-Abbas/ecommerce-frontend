import { useState } from "react";
import api from "../../axios";
import toast from "react-hot-toast";

export const useApiResponse = ({
  endpoint,
  method = "GET",
  body = null,
  params = {},
  config = {},
  isToast = false,
}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchApi = async () => {
    setLoading(true);
    setError(null);

    try {
      const httpMethod = method.toUpperCase();
      const headers = { ...(config.headers || {}) };
      if (body instanceof FormData) {
        headers["Content-Type"] = "multipart/form-data";
      }

      const methodMap = {
        GET: () => api.get(endpoint, { params, ...config, headers }),
        POST: () => api.post(endpoint, body, { params, ...config, headers }),
        PATCH: () => api.patch(endpoint, body, { params, ...config, headers }),
        DELETE: () => api.delete(endpoint, { params, ...config, headers }),
      };

      if (!methodMap[httpMethod]) {
        throw new Error(`Invalid HTTP method: ${method}`);
      }

      const response = await methodMap[httpMethod](); 
      setData(response.data);

      if (isToast) {
        toast.success(response?.data?.message || "Request successful");
      }
    } catch (err) {
      setError(err);
      if (isToast) {
        toast.error(err?.response?.data?.message || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fetchApi };
};
