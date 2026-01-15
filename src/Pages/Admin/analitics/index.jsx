import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApiResponse } from "@/hooks/ResponseApiHook";

import SummaryCards from "@/components/vendor/Report/summaryCard";
import RevenueChart from "@/components/vendor/Report/revneueChart";
import CategoryReport from "@/components/vendor/Report/categoryReport";
import RevenueCommissionChart from "@/components/admin/analyticComponent/RevenuChart";
import UserGrowthChart from "@/components/admin/analyticComponent/userGrowthChart";
import TopPerformingVendors from "@/components/admin/analyticComponent/vendorChart";

export default function AdminReports() {
  const [activeTab, setActiveTab] = useState("overview");

  // DATA STATES
  const [summary, setSummary] = useState({});
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

  // API HOOK
  const { fetchApi, loading } = useApiResponse({ method: "get" });

  // SUMMARY
  useEffect(() => {
    const fetchSummary = async () => {
      const res = await fetchApi({},"/vendor/summary");
      if (!res) return;

      const s = res.data;
      setSummary({
        totalRevenue: Number(s.totalRevenue) || 0,
        totalOrders: Number(s.totalOrder) || 0,
        avgOrderValue: Number(s.averageOrder) || 0,
        conversionRate: Number(s.conversionRate) || 0,
      });
    };

    fetchSummary();
  }, []);

  // TAB BASED FETCH
  useEffect(() => {
    const fetchTabData = async () => {
      // OVERVIEW
      if (activeTab === "overview" && !loaded.overview) {
        const [revenueRes, categoryRes] = await Promise.all([
          fetchApi({},"/admin/weeklyrevenue"),
          fetchApi({},"/admin/categoryreport"),
        ]);

        setWeeklyRevenue(revenueRes?.data?.data || []);
        setCategories(categoryRes?.data?.data || []);
        setLoaded((p) => ({ ...p, overview: true }));
      }

      // REVENUE
      if (activeTab === "revenue" && !loaded.revenue) {
        const res = await fetchApi({},"/admin/getrevenuecommission");
        setRevenue(res?.data?.data || []);
        setLoaded((p) => ({ ...p, revenue: true }));
      }

      // USER
      if (activeTab === "user" && !loaded.user) {
        const res = await fetchApi({},"/admin/getusergrowth");
        setUser(res?.data?.data  || []);
        setLoaded((p) => ({ ...p, user: true }));
      }

      // VENDOR
      if (activeTab === "vendor" && !loaded.vendor) {
        const res = await fetchApi({},"/admin/topvendors");
        setVendor(res?.data?.data  || []);
        setLoaded((p) => ({ ...p, vendor: true }));
      }

      // CATEGORIES
      if (activeTab === "categories" && !loaded.categories) {
        const res = await fetchApi({},"/admin/categoryreport");
        setCategories(res?.data?.data  || []);
        setLoaded((p) => ({ ...p, categories: true }));
      }
    };

    fetchTabData();
  }, [activeTab, loaded]);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-display font-bold">
          Reports & Analytics
        </h1>
        <p className="text-muted-foreground">
          Insights to grow your business
        </p>
      </div>

      {/* SUMMARY */}
      <SummaryCards summary={summary} loading={loading} />

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
          <RevenueChart data={weeklyRevenue} heading="Weekly" loading={loading}  />
          <CategoryReport
            data={categories}
            show="false"
            className="grid-cols-1 h-full"
            loading={loading}
          />
        </TabsContent>

        {/* REVENUE */}
        <TabsContent value="revenue">
          <RevenueCommissionChart data={revenue} loading={loading} />
        </TabsContent>

        {/* USER */}
        <TabsContent value="user">
          <UserGrowthChart data={user} />
        </TabsContent>

        {/* VENDOR */}
        <TabsContent value="vendor">
          <TopPerformingVendors data={vendor} />
        </TabsContent>

        {/* CATEGORIES */}
        <TabsContent value="categories">
          <CategoryReport data={categories} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
