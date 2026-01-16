import { useState, useEffect } from "react";
import { useApiResponse } from "@/hooks/ResponseApiHook";

export const useDashboardStats = (url, initialState, mapper) => {
  const [stats, setStats] = useState(initialState);
  const { fetchApi, loading, error } = useApiResponse({ method: "get" });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetchApi({}, url);
        if (res?.data?.success) {
          setStats((prev) => mapper(res.data.data, prev));
        }
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      }
    };
    fetchStats();
  }, [url]);

  return { stats, loading, error };
};
