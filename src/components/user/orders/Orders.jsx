import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useApiResponse } from "@/hooks/ResponseApiHook";
import { setOrders } from "@/Redux/orderSlice/orderSlice";
import OrderCardItem from "./orderCard";
import PaginationSection from "../shared/pagination";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";

const Orders = ({ orderData, data, setActiveTab }) => {
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
  }, [searchParams]);

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
// top header data
const start = (pagination.page - 1) * Number(pagination.limit) + 1;
const end = Math.min(pagination.page * Number(pagination.limit), pagination.totalItems);
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
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-linear-to-r from-(--primary-color) to-[#873d3d] p-3 rounded-full">
          <Package className=" w-6 h-6 lg:w-8 lg:h-8 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold">My Orders</h1>
          <p className="text-gray-500 text-sm">
           From {start}-{end} of {pagination.totalItems}
          </p>
        </div>
      </div>
      {/* card content */}
      
      <Card className="shadow rounded-xl pt-4">
        <CardHeader className="flex justify-between items-center border-b ">
          <CardTitle className="text-lg">Orders</CardTitle>

          {data ? (
            <Button
              onClick={() => setActiveTab("orders")}
              className="bg-(--primary-color) hover:bg-(--hover-primary-color) text-white text-sm"
            >
              {data}
            </Button>
          ) : (
            <div className="border rounded-xl pr-2">
            <select
              className=" px-3 py-2 "
              value={pagination.limit}
              onChange={(e) => changeLimit(e.target.value)}
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
              <option value="all">All</option>
            </select>
            </div>
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

export default Orders; 
