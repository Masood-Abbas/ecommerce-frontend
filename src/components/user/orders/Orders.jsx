import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useApiResponse } from "@/hooks/ResponseApiHook";
import { setOrders } from "@/Redux/orderSlice/orderSlice";
import OrderCardItem from "./orderCard";
import PaginationSection from "../shared/pagination";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const OrdersTab = ({ orderData, data, setActiveTab }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const userId = useSelector((state) => state.auth.user.id);
  const { fetchApi } = useApiResponse({
    method: "get",
    reduxAction: setOrders,
  });

  const [pagination, setPagination] = useState({
    page: Number(searchParams.get("page")) || 1,
    limit: searchParams.get("limit") || "10",
    totalPages: 0,
    totalItems: 0,
  });

  const [localOrders, setLocalOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Fetch orders when URL params change
  useEffect(() => {
    if (orderData) return;

    const page = Number(searchParams.get("page")) || 1;
    const limit = searchParams.get("limit") || "10";

    setPagination((prev) => ({ ...prev, page, limit }));

    const getOrders = async () => {
      setLoadingOrders(true);

      try {
        const params = {
          page,
          limit: limit === "all" ? 999999 : Number(limit),
        };

        const res = await fetchApi(params, `/order/getuserorder/${userId}`);
        const apiData = res?.data?.data;

        setPagination((prev) => ({
          ...prev,
          totalPages: apiData?.totalPages || 0,
          totalItems: apiData?.totalOrders || 0,
        }));

        setLocalOrders(apiData?.orders || []);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setTimeout(() => setLoadingOrders(false), 300);
      }
    };

    getOrders();
  }, [searchParams, userId]);

  const showOrders = orderData?.length ? orderData : localOrders;

  // Change Page
  const goToPage = (newPage) => {
    setSearchParams({
      tab: "orders",
      page: newPage,
      limit: pagination.limit,
    });

    navigate(`/profile?tab=orders&page=${newPage}&limit=${pagination.limit}`);
  };

  // Change Limit
  const changeLimit = (newLimit) => {
    setSearchParams({
      tab: "orders",
      page: 1,
      limit: newLimit,
    });

    navigate(`/profile?tab=orders&page=1&limit=${newLimit}`);
  };

  // Loading UI
  if (loadingOrders) {
    return (
      <p className="text-gray-500 text-sm text-center mt-4">
        Loading orders...
      </p>
    );
  }

  // No orders
  if (!showOrders?.length) {
    return (
      <p className="text-gray-500 text-sm text-center mt-4">No orders found.</p>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Manage My Orders</h1>

      <Card className="shadow rounded-xl">
        <CardHeader className="flex justify-between items-center">
          <CardTitle className="text-lg">Orders</CardTitle>

          {data ? (
            <Button
              onClick={() => setActiveTab("orders")}
              className="bg-(--primary-color) hover:bg-(--hover-primary-color) text-white text-sm"
            >
              {data}
            </Button>
          ) : (
            <select
              className="border px-3 py-2 rounded-md"
              value={pagination.limit}
              onChange={(e) => changeLimit(e.target.value)}
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
              <option value="all">All</option>
            </select>
          )}
        </CardHeader>

        <CardContent className="space-y-4">
          {showOrders.map((order) => (
            <OrderCardItem key={order.id} order={order} />
          ))}
        </CardContent>
      </Card>

      {!orderData && (
        <div className="mt-6">
          <PaginationSection pagination={pagination} goToPage={goToPage} />
        </div>
      )}
    </>
  );
};

export default OrdersTab;
