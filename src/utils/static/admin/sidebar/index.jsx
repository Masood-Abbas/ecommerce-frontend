import {
  LayoutDashboard,
  Box,
  ShoppingCart,
  Users,
  BarChart2,
  LogOut,
  Store,
} from "lucide-react";

export const menuItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
  { label: "Vendors", icon: Store, path: "/admin/vendors" },
  { label: "Products", icon: Box, path: "/vendor/products" },
  { label: "Orders", icon: ShoppingCart, path: "/vendor/orders" },
  { label: "Customers", icon: Users, path: "/vendor/customers" },
  { label: "Analytics", icon: BarChart2, path: "/vendor/analytics" },
  { label: "Store Info", icon: Store, path: "/vendor/storeInfo" },
];