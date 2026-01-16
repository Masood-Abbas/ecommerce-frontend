import { DollarSign, Package, TrendingUp } from "lucide-react";

export const analyticData = {
  heading: "Reports & Analytics",
  para: "Insights to grow your business",
};

export const intialAnalyticData = {
  totalRevenue: {
    title: "Total Revenue",
    value: "0",
    icon: DollarSign,
    iconBg: "bg-cyan-100 text-cyan-700",
    negative: true,
  },
  totalOrder: {
    title: "Total Order",
    value: "0",
    icon: Package,
    iconBg: "bg-blue-100 text-blue-700",
  },
  avgOrderValue: {
    title: "Avg Order Value",
    value: "0",
    icon: TrendingUp ,
    iconBg: "bg-green-100 text-green-800",
  },
};