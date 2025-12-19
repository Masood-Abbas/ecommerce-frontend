import { useState } from "react";
import { useDispatch } from "react-redux";
import api from "@/axios";
import toast from "react-hot-toast";

export const useApiResponse = ({
  endpoint,
  method = "GET",
  body = {},
  params = {},
  config = {},
  reduxAction = null,
  isToast = false,
}) => {
  const dispatch = useDispatch();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  

  const fetchApi = async (customParams = {},customendPoint, customBody = {}) => {
    setLoading(true);
    setError(null);
    try {
      const finalParams = { ...params, ...customParams };
      const  finalendPoint=customendPoint||endpoint
      const finalBody = customBody || body;
      const headers = { ...(config.headers || {}) };
      if (finalBody instanceof FormData) {
        headers["Content-Type"] = "multipart/form-data";
      }
      const httpMethod = method.toUpperCase();
      const methodMap = {
        GET: () =>
          api.get(finalendPoint, { params: finalParams, ...config, headers }),
        POST: () =>
          api.post(finalendPoint, finalBody, {
            params: finalParams,
            headers,
            ...config,
          }),
        PATCH: () =>
          api.patch(finalendPoint, finalBody, {
            params: finalParams,
            headers,
            ...config,
          }),
        DELETE: () =>
          api.delete(finalendPoint,{data:finalBody, params: finalParams, headers, ...config }),
      };

      if (!methodMap[httpMethod]) {
        throw new Error(`Invalid HTTP method: ${method}`);
      }

      const response = await methodMap[httpMethod]();
      setData(response.data.data);

      if (reduxAction) {
        const payload =
          response?.data?.data?.products ||
          response?.data?.data ||
          response?.data ||
          [];
          
        dispatch(reduxAction(payload));
      }

      if (isToast) {
        toast.success(response?.data?.message || "Request successful");
      }

      return response;
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



