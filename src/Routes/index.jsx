import { createBrowserRouter } from "react-router-dom";

// Layouts

// Protected Route
import ProtectedRoute from "@/components/ProtecetedRoute";

// User Pages
import {
  CartPage,
  CheckoutPage,
  ContactPage,
  Home,
  Login,
  PasswordReset,
  ProductDetail,
  ProductPage,
  ProfilePage,
  Signup,
} from "@/Pages/user";
// components
import Orders from "@/components/user/orders/Orders";
import SearchResultsPage from "@/Pages/user/searchProduct";
// vendor
import VendorDashboard from "@/Pages/vendor/dashoard";
import VendorProducts from "@/Pages/vendor/product";
// layouts
import UserLayout from "@/layouts/UserLayout/UserLayout";
import VendorLayout from "@/layouts/VendorLayout/VendorLayout";
import VendorOrders from "@/Pages/vendor/orders";
import Reports from "@/Pages/vendor/analitics";
import CustomersDashboard from "@/Pages/vendor/customer";

// Vendor Pages

export const routes = [
  {
    element: <UserLayout />,
    children: [
      // Public
      { path: "/", element: <Home /> },
      { path: "/signup", element: <Signup /> },
      { path: "/login", element: <Login /> },
      { path: "/contact", element: <ContactPage /> },
      { path: "/products", element: <ProductPage /> },
      { path: "/search", element: <SearchResultsPage /> },
      { path: "/product/:id", element: <ProductDetail /> },
      { path: "/reset-password/*", element: <PasswordReset /> },

      // Protected User Routes
      {
        element: <ProtectedRoute role="user" />,
        children: [
          { path: "/cart", element: <CartPage /> },
          { path: "/order", element: <Orders /> },
          { path: "/profile", element: <ProfilePage /> },
          { path: "/checkout", element: <CheckoutPage /> },
        ],
      },
    ],
  },

  // Vendor Routes
  {
    path: "/vendor",
    element: <VendorLayout />,
    children: [
      { path: "dashboard", element: <VendorDashboard /> },
      { path: "products", element: <VendorProducts /> },
      { path: "orders", element: <VendorOrders /> },
      { path: "analytics", element: <Reports /> },
      { path: "customers", element: <CustomersDashboard /> },
    ],
  },
];

export const router = createBrowserRouter(routes);
