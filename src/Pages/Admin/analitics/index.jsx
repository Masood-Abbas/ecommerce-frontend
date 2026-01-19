import { useEffect, useState } from "react";
import { useApiResponse } from "@/hooks/ResponseApiHook";
import { useDashboardStats } from "@/hooks/useAdminState";
import PageHeader from "@/components/admin/shared/pageHeader";
import { StatCard } from "@/components/admin/shared/stateCard";
import { mapStatsFromApi } from "@/utils/admin/adminStateMapper";
import RevenueChart from "@/components/vendor/Report/revneueChart";
import CategoryReport from "@/components/vendor/Report/categoryReport";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserGrowthChart from "@/components/admin/analyticComponent/userGrowthChart";
import TopPerformingVendors from "@/components/admin/analyticComponent/vendorChart";
import {
  analyticData,
  intialAnalyticData,
} from "@/utils/static/admin/analyticData";
import RevenueCommissionChart from "@/components/admin/analyticComponent/RevenuChart";

export default function AdminReports() {
  const [activeTab, setActiveTab] = useState("overview");
  const { stats } = useDashboardStats(
    "/admin/analyticsummary",
    intialAnalyticData,
    mapStatsFromApi
  );

  // DATA STATES
  const [weeklyRevenue, setWeeklyRevenue] = useState([]);
  const [categories, setCategories] = useState([]);
  const [revenue, setRevenue] = useState([]);
  const [user, setUser] = useState([]);
  const [vendor, setVendor] = useState([]);

  // PREVENT MULTIPLE CALLS
  const [loaded, setLoaded] = useState({
    overview: false,
    revenue: false,
    categories: false,
    user: false,
    vendor: false,
  });

  const { fetchApi, loading } = useApiResponse({ method: "get" });

  // Tab based detch data
  useEffect(() => {
    const fetchTabData = async () => {
      // OVERVIEW
      if (activeTab === "overview" && !loaded.overview) {
        const [revenueRes, categoryRes] = await Promise.all([
          fetchApi({}, "/admin/weeklyrevenue"),
          fetchApi({}, "/admin/categoryreport"),
        ]);

        setWeeklyRevenue(revenueRes?.data?.data?.data || []);
        setCategories(categoryRes?.data?.data?.data || []);
        setLoaded((p) => ({ ...p, overview: true }));
      }

      // REVENUE
      if (activeTab === "revenue" && !loaded.revenue) {
        const res = await fetchApi({}, "/admin/getrevenuecommission");
        setRevenue(res?.data?.data?.data || []);
        setLoaded((p) => ({ ...p, revenue: true }));
      }

      // USER
      if (activeTab === "user" && !loaded.user) {
        const res = await fetchApi({}, "/admin/getusergrowth");
        setUser(res?.data?.data?.data || []);
        setLoaded((p) => ({ ...p, user: true }));
      }

      // VENDOR
      if (activeTab === "vendor" && !loaded.vendor) {
        const res = await fetchApi({}, "/admin/topvendors");
        setVendor(res?.data?.data?.data || []);
        setLoaded((p) => ({ ...p, vendor: true }));
      }

      // CATEGORIES
      if (activeTab === "categories" && !loaded.categories) {
        const res = await fetchApi({}, "/admin/categoryreport");
        setCategories(res?.data?.data?.data || []);
        setLoaded((p) => ({ ...p, categories: true }));
      }
    };

    fetchTabData();
  }, [activeTab, loaded]);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <PageHeader data={analyticData} />

      {/* SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(stats).map(([key, value]) => (
          <StatCard
            key={key}
            title={value.title || "Users"}
            value={value.value || "0"}
            negative={value.negative}
            icon={value.icon}
            iconBg={value.iconBg}
            cla
          />
        ))}
      </div>

      {/* TABS */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="user">User</TabsTrigger>
          <TabsTrigger value="vendor">Vendor</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        {/* OVERVIEW */}
        <TabsContent
          value="overview"
          className="grid grid-cols-1 lg:grid-cols-2 gap-5"
        >
          <RevenueChart
            data={weeklyRevenue}
            heading="Weekly"
            para="Daily revenue for the current week"
            loading={loading}
          />
          <CategoryReport
            data={categories}
            para="Sales by product category"
            show="false"
            className="grid-cols-1 h-full"
            loading={loading}
          />
        </TabsContent>

        {/* Revenue */}
        <TabsContent value="revenue">
          <RevenueCommissionChart data={revenue} loading={loading} />
        </TabsContent>

        {/* user */}
        <TabsContent value="user">
          <UserGrowthChart data={user} />
        </TabsContent>

        {/* Vendor */}
        <TabsContent value="vendor">
          <TopPerformingVendors data={vendor} />
        </TabsContent>

        {/* Category */}
        <TabsContent value="categories">
          <CategoryReport data={categories} para="Sales by product category" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
