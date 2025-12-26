import { useEffect, useState } from "react";
import { StatCard } from "@/components/vendor/dashboard/stateCard";
import RecentOrders from "@/components/vendor/dashboard/orders";
import TopProducts from "@/components/vendor/dashboard/products";

export default function VendorDashboardHome() {
  // const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   const fetchStats = async () => {
  //     try {
  //       const res = await api.get("/vendor/dashboard-stats");
  //       setStats(res.data.data);
  //     } catch (err) {
  //       console.error(err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchStats();
  // }, []);

  const stats = {
  revenue: "$24,680",
  revenueChange: "+12.5%",
  orders: "156",
  orderChange: "+8.2%",
  products: "89",
  productChange: "-2.4%",
  customers: "1,234",
  customerChange: "+15.8%",
};

  if (loading) return <p>Loading...</p>;
  if (!stats) return <p>No data</p>;

  return (
    <>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard title="Total Revenue" value={stats.revenue} change={stats.revenueChange} />
      <StatCard title="Total Orders" value={stats.orders} change={stats.orderChange} />
      <StatCard
        title="Products"
        value={stats.products}
        change={stats.productChange}
        negative
      />
      <StatCard title="Customers" value={stats.customers} change={stats.customerChange} />
    </div>
     <div className="py-6 space-y-6">
      <RecentOrders />
      <TopProducts />
    </div>
    </>
  );
}
