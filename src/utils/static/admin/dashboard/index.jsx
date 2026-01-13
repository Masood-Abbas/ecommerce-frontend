import { DollarSign, Store, TrendingUp, Users } from "lucide-react";

// dashbord heading
export const data = {
    heading: "Admin Dashboard",
    para: "Platform overview and management",
  };
// card data
export const intialData={
    totalVendor: {
      title: "Total Vendor",
      value: "$0",
      icon: Store,
      iconBg: "bg-blue-100 text-blue-700",
    },
    platformRevenue: {
      title: "Platform Revenue",
      value: "0",
      icon: DollarSign,
      iconBg: "bg-green-100 text-green-700",
    },
    platformEarnings: {
      title: "Platform Earnings",
      value: "0",
      icon: TrendingUp ,
      iconBg: "bg-red-100 text-red-700",
      negative: true,
    },
    totalUser: {
      title: "Users",
      value: "0",
      icon: Users,
      iconBg: "bg-cyan-100 text-cyan-700",
    },
  }
// vendor column
export const vendorColumns = [
  {
    header: "ID",
    render: (row) => `${row.id}`,
  },
  {
    header: "NAME",
    render: (row) => row.name || "—",
  },
  {
    header: "EMAIL",
    render: (row) => row.email || "—",
  },
  {
    header: "SHOP NAME",
    render: (row) => row.shop?.name || "N/A",
  },
  {
    header: "PRODUCTS",
    render: (row) => row.totalProducts ?? 0,
  },
  {
    header: "Orders",
    render: (row) => row.totalOrders ?? 0,
  },
  {
    header: "Revenue",
    render: (row) => row.totalRevenue ?? 0,
  },
  {
    header: "Commission",
    render: (row) => `${row.commissionPercent}%`?? 0,
  },
];

