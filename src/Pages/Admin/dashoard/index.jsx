import { StatCard } from "@/components/vendor/dashboard/stateCard";
import PageHeader from "@/components/admin/shared/pageHeader";
import {
  data,
  intialData,
  orderColumns,
  orderData,
  producDashboardtData,
  productColumns,
  vendorColumns,
  vendorData,
} from "@/utils/static/admin/dashboard";
import DashbordTable from "@/components/admin/dashboard/TopVendor";
import { useDashboardStats } from "@/hooks/useAdminState";
import { mapStatsFromApi } from "@/utils/admin/adminStateMapper";
import RevenueChart from "@/components/admin/dashboard/adminRevenueChart";
import { useEffect, useState } from "react";
import { useApiResponse } from "@/hooks/ResponseApiHook";
import TopPerformingVendors from "@/components/admin/analyticComponent/vendorChart";

export default function AdminDashboard() {
  const [weeklyRevenue, setWeeklyRevenue] = useState([]);
   const [vendor, setVendor] = useState([]);
  const { fetchApi, loading } = useApiResponse({ method: "get" });
  const { stats } = useDashboardStats(
    "/admin/admindashboardstats",
    intialData,
    mapStatsFromApi
  );

  useEffect(() => {
    const fetchTabData = async () => {
      const [revenueRes, categoryRes] = await Promise.all([
        fetchApi({}, "/admin/getrevenuecommission"),
        fetchApi({}, "/admin/topvendors"),
      ]);

      setWeeklyRevenue(revenueRes?.data?.data?.data || []);
      setVendor(categoryRes?.data?.data?.data || []);
      setLoaded((p) => ({ ...p, overview: true }));
    };

    fetchTabData();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader data={data} />
      {/* cards */}
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

      {/* charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <RevenueChart data={weeklyRevenue} heading="Weekly" loading={loading} />
        <TopPerformingVendors
          data={vendor}
          show="false"
          className="grid-cols-1 h-full"
          loading={loading}
        />
      </div>

      

      <div className="space-y-6">
        {/* <RecentOrders url={"/admin/getorderforadmin"} /> */}
        <DashbordTable DashboardData={orderData} column={orderColumns} />
        <DashbordTable
          DashboardData={producDashboardtData}
          column={productColumns}
        />
        <DashbordTable DashboardData={vendorData} column={vendorColumns} />
      </div>
    </div>
  );
}
