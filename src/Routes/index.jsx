import { createBrowserRouter } from "react-router-dom";

import Orders from "@/components/user/orders/Orders";
import MainLayout from "@/layouts/MainLayout ";
import ProtectedRoute from "@/components/ProtecetedRoute";
import {
  CartPage,
  // CategoryPage,
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
import SearchResultsPage from "@/Pages/user/searchProduct";
export const routes = [
  {
    element: <MainLayout />,
    children: [
      // Public Routes
      { path: "/", element: <Home /> },
      { path: "/signup", element: <Signup /> },
      { path: "/login", element: <Login /> },
      { path: "/contact", element: <ContactPage /> },
      { path: "/products", element: <ProductPage /> },
      { path: "/search", element: <SearchResultsPage /> },
      // { path: "/category/:id", element: <CategoryPage /> },
      { path: "/product/:id", element: <ProductDetail /> },
      { path: "/reset-password/*", element: <PasswordReset /> },

      {
        element: <ProtectedRoute />,
        children: [
          { path: "/cart", element: <CartPage /> },
          { path: "/order", element: <Orders /> },
          { path: "/profile", element: <ProfilePage /> },
          { path: "/checkout", element: <CheckoutPage /> },
        ],
      },
    ],
  },
];

export const router = createBrowserRouter(routes);
