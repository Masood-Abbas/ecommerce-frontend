import { useEffect, useState } from "react";
import { StatCard } from "@/components/vendor/dashboard/stateCard";
import TopProducts from "@/components/vendor/dashboard/products";
import { useApiResponse } from "@/hooks/ResponseApiHook";
import LoadingSpot from "@/components/ui/spinner/loadingSpiner";
import PageHeader from "@/components/admin/pageHeader";
import { data, intialData } from "@/utils/static/admin/dashboard";
import RecentOrders from "@/components/vendor/dashboard/orders";
import TopVendors from "@/components/admin/dashboard/TopVendor";

export default function AdminDashboard() {
  const [stats, setStats] = useState(intialData);

  const {
    fetchApi: fetchDashboardStats,
    loading,
    error,
  } = useApiResponse({ method: "get" });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetchDashboardStats({}, "/admin/admindashboardstats");
        if (res?.data?.success) {
          const data = res?.data?.data ?? {};

          setStats((prev) => ({
            totalVendor: {
              ...prev.totalVendor,
              value: `$${Number(data.totalVendor || 0).toLocaleString()}`,
            },
            platformRevenue: {
              ...prev.platformRevenue,
              value: Number(data.platformRevenue || 0).toLocaleString(),
            },
            platformEarnings: {
              ...prev.platformEarnings,
              value: Number(data.platformEarnings || 0).toLocaleString(),
            },
            totalUser: {
              ...prev.totalUser,
              value: Number(data.totalUser || 0).toLocaleString(),
            },
          }));
        }
      } catch (err) {
        console.error("Failed to fetch dashboard stats:", err);
      }
    };

    fetchStats();
  }, []);
  
  return (
    <div className="space-y-6">
      <PageHeader data={data} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(stats).map(([key, value]) => (
          <StatCard
            key={key}
            title={value.title || "Users"}
            value={value.value || "0"}
            negative={value.negative}
            icon={value.icon}
            iconBg={value.iconBg}
          />
        ))}
      </div>

      <div className="space-y-6">
        <RecentOrders url={"/admin/getorderforadmin"} />
        <TopProducts  url={"/admin/getallproductforadmin"}/>
        <TopVendors/>

      </div>
      {error && (
        <p className="text-center py-10 text-red-600">
          {typeof error === "string"
            ? error
            : error?.message || "Something went wrong"}
        </p>
      )}
    </div>
  );
}
