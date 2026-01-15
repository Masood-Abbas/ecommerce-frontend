import {
  LayoutDashboard,
  Box,
  ShoppingCart,
  Users,
  BarChart2,
  LogOut,
  Store,
  FolderTree,
} from "lucide-react";

export const menuItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
  { label: "Vendors", icon: Store, path: "/admin/vendors" },
  { label: "Category", icon: FolderTree, path: "/admin/category" },
  { label: "Products", icon: Box, path: "/admin/products" },
  { label: "Orders", icon: ShoppingCart, path: "/admin/orders" },
  { label: "User", icon: Users, path: "/admin/user" },
  { label: "Analytics", icon: BarChart2, path: "/admin/analytics" },
];