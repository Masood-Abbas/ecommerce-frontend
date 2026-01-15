import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import api from "@/axios";
import SummaryCards from "@/components/vendor/Report/summaryCard";
import RevenueChart from "@/components/vendor/Report/revneueChart";
import OrdersChart from "@/components/vendor/Report/orderChart";
import CategoryReport from "@/components/vendor/Report/categoryReport";

export default function Reports() {
  const [activeTab, setActiveTab] = useState("revenue");

  const [summary, setSummary] = useState({});
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [monthlyOrders, setMonthlyOrders] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loaded, setLoaded] = useState({
    revenue: false,
    orders: false,
    categories: false,
  });

  //  Summary
  useEffect(() => {
    api.get("/vendor/summary").then((res) => {
      const s = res.data.data;
      setSummary({
        totalRevenue: Number(s.totalRevenue) || 0,
        totalOrders: Number(s.totalOrder) || 0,
        avgOrderValue: Number(s.averageOrder) || 0,
        conversionRate: Number(s.conversionRate) || 0,
      });
    });
  }, []);

  useEffect(() => {
    const fetchTabData = async () => {
      try {
        if (activeTab === "revenue" && !loaded.revenue) {
          const res = await api.get("/vendor/monthlyrevneu");
          setMonthlyRevenue(res.data.data || []);
          setLoaded((p) => ({ ...p, revenue: true }));
        }

        if (activeTab === "categories" && !loaded.categories) {
          const res = await api.get("/vendor/categoryreport");
          setCategories(res.data.data || []);
          setLoaded((p) => ({ ...p, categories: true }));
        }
      } catch (err) {
        console.error("Tab API error:", err);
      }
    };

    fetchTabData();
  }, [activeTab, loaded]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">   
        <div>
          <h1 className="text-2xl font-display font-bold">
            Reports & Analytics
          </h1>
          <p className="text-muted-foreground">
            Insights to grow your business
          </p>
        </div>
      </div>
      {/* summary */}
      <SummaryCards summary={summary} />
      {/* tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger className="cursor-pointer" value="revenue">Revenue</TabsTrigger>
          <TabsTrigger className="cursor-pointer" value="orders">Orders</TabsTrigger>
          <TabsTrigger className="cursor-pointer" value="categories">Categories</TabsTrigger>
        </TabsList>
        {/* Revnue */}
        <TabsContent value="revenue">
          <RevenueChart data={monthlyRevenue} />
        </TabsContent>
        {/* order  */}
        <TabsContent value="orders">
          <OrdersChart data={monthlyRevenue} />
        </TabsContent>
        {/* category */}
        <TabsContent value="categories">
          <CategoryReport data={categories} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
