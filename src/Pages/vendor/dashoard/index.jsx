import { useEffect, useState } from "react";
import { DollarSign, Package, ShoppingCart, Users } from "lucide-react";
import { StatCard } from "@/components/vendor/dashboard/stateCard";
import RecentOrders from "@/components/vendor/dashboard/orders";
import TopProducts from "@/components/vendor/dashboard/products";
import { useApiResponse } from "@/hooks/ResponseApiHook";

export default function VendorDashboardHome() {
  const [stats, setStats] = useState({
    revenue: { value: "$0", change: "0%", icon: DollarSign, iconBg: "bg-blue-100 text-blue-700" },
    orders: { value: "0", change: "0%", icon: ShoppingCart, iconBg: "bg-green-100 text-green-700" },
    products: { value: "0", change: "0%", icon: Package, iconBg: "bg-red-100 text-red-700", negative: true },
    customers: { value: "0", change: "0%", icon: Users, iconBg: "bg-cyan-100 text-cyan-700" },
  });

  const { fetchApi: fetchDashboardStats, loading, error } = useApiResponse({ method: "get" });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetchDashboardStats({}, "/vendor/dashboardstats");
        if (res?.success) {
          const data = res?.data?.data ?? {};

          setStats((prev) => ({
            revenue: {
              ...prev.revenue,
              value: `$${Number(data.totalRevenue || 0).toLocaleString()}`,
              change: "+12.5%",
            },
            orders: {
              ...prev.orders,
              value: Number(data.totalOrders || 0).toLocaleString(),
              change: "+8.2%",
            },
            products: {
              ...prev.products,
              value: Number(data.products || 0).toLocaleString(),
              change: "-2.4%",
            },
            customers: {
              ...prev.customers,
              value: Number(data.totalCustomers || 0).toLocaleString(),
              change: "+15.8%",
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
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(stats).map(([key, value]) => (
          <StatCard
            key={key}
            title={key.charAt(0).toUpperCase() + key.slice(1)}
            value={value.value || "0"}
            change={value.change || "0%"}
            negative={value.negative}
            icon={value.icon}
            iconBg={value.iconBg}
          />
        ))}
      </div>

      <div className="space-y-6">
        <RecentOrders />
        <TopProducts />
      </div>

      {loading && (
        <div className="absolute inset-0 bg-white/50 flex items-center justify-center text-gray-500 text-lg font-medium">
          Loading dashboard...
        </div>
      )}
      {error && (
        <p className="text-center py-10 text-red-600">
          {typeof error === "string" ? error : error?.message || "Something went wrong"}
        </p>
      )}
    </div>
  );
}
