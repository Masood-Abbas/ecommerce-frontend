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

  // Pagination state
  const [pagination, setPagination] = useState({
    page: Number(searchParams.get("page")) || 1,
    limit: Number(searchParams.get("limit")) || 5,
    totalPages: 0,
    totalItems: 0,
  });

  const [localOrders, setLocalOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Update pagination when URL changes
  // useEffect(() => {
  //   const page = Number(searchParams.get("page")) || 1;
  //   const limit = Number(searchParams.get("limit")) || 5;

  //   setPagination((prev) => ({ ...prev, page, limit }));
  // }, [searchParams]);

  // Fetch orders
  useEffect(() => {
    if (orderData) return;
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 5;

    setPagination((prev) => ({ ...prev, page, limit }));

    const getOrders = async () => {
      setLoadingOrders(true);

      try {
        const params = {
          page: pagination.page,
          limit: pagination.limit,
        };

        const res = await fetchApi(params, `/order/getuserorder/${userId}`);
        const data = res?.data?.data;

        setPagination((prev) => ({
          ...prev,
          totalPages: data?.totalPages || 0,
          totalItems: data?.orders?.length || 0,
        }));

        setLocalOrders(data?.orders || []);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setTimeout(() => setLoadingOrders(false), 300); // smooth loading
      }
    };

    getOrders();
  }, [pagination.page, pagination.limit, userId,searchParams]);

  const showOrders = orderData?.length ? orderData : localOrders;

  // Change page
  const goToPage = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
    setSearchParams({ page: newPage, limit: pagination.limit });
    navigate(`/profile?tab=orders&page=${newPage}&limit=${pagination.limit}`);
  };

  // Loading UI
  if (loadingOrders) {
    return (
      <p className="text-gray-500 text-sm text-center mt-4">Loading orders...</p>
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
      <Card className="shadow rounded-xl">
        <CardHeader className="flex justify-between items-center">
          <CardTitle className="text-lg">Orders</CardTitle>

          {data && (
            <Button
              onClick={() => setActiveTab("orders")}
              className="bg-[var(--primary-color)] hover:bg-[var(--hover-primary-color)] text-white text-sm"
            >
              {data}
            </Button>
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
