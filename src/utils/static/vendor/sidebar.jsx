import {
  LayoutDashboard,
  Box,
  ShoppingCart,
  Users,
  BarChart2,
  Settings,
  HelpCircle,
  LogOut,
} from "lucide-react";

export const menuItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/vendor/dashboard" },
  { label: "Products", icon: Box, path: "/vendor/products" },
  { label: "Orders", icon: ShoppingCart, path: "/vendor/orders" },
  { label: "Customers", icon: Users, path: "/vendor/customers" },
  { label: "Analytics", icon: BarChart2, path: "/vendor/analytics" },
];

export const bottomItems = [
  { label: "Settings", icon: Settings, path: "/vendor/settings" },
  { label: "Help & Support", icon: HelpCircle, path: "/vendor/help" },
  { label: "Logout", icon: LogOut, path: "/logout" },
];