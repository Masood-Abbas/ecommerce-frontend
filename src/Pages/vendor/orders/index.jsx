import { useEffect, useState } from "react";
import PaginationSection from "@/components/user/shared/pagination";
import { useApiResponse } from "@/hooks/ResponseApiHook";
import SearchInputApi from "@/components/vendor/searchInput";
import { Package, Clock, Truck, CheckCircle, XCircle } from "lucide-react";
import LoadingSpot from "@/components/ui/spinner/loadingSpiner";

const STATUS_COLORS = {
  pending: "bg-amber-100 text-amber-800",
  processing: "bg-sky-100 text-sky-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  all: "bg-gray-100 text-gray-800",
};

const STATUS_OPTIONS = ["pending", "processing", "shipped", "delivered", "cancelled"];

export default function VendorOrders() {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({});
  const [statusFilter, setStatusFilter] = useState("all");
  const [stats, setStats] = useState({});
  const [editingOrderId, setEditingOrderId] = useState(null); 

  const { fetchApi, loading } = useApiResponse({ method: "get" });
  const { fetchApi: updateApi } = useApiResponse({ method: "patch" });
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  // Fetch stats
  const fetchStats = async () => {
    const res = await fetchApi({}, "/order/filterstaus");
    if (res?.data?.success) setStats(res.data.data);
  };

  // Fetch orders
  const fetchOrders = async () => {
    const params = {
      page,
      limit,
      status: statusFilter,
      search: searchText || undefined,
    };
    const res = await fetchApi(params, "/order/getorderbyspecficshop");
    if (res?.data?.success) {
      setOrders(res.data.data.orders || []);
      setPagination(res.data.data.pagination || {});
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [page, statusFilter, searchText]);

  // Update order status
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await updateApi({}, `/order/updateorderstatus/${orderId}`,{ status: newStatus });
      if (res?.data?.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
        setEditingOrderId(null); 
      }
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const statusCards = [
    { label: "Total", status: "all", count: stats.total || 0, icon: Package },
    { label: "Pending", status: "pending", count: stats.pending || 0, icon: Clock },
    { label: "Processing", status: "processing", count: stats.processing || 0, icon: Package },
    { label: "Shipped", status: "shipped", count: stats.shipped || 0, icon: Truck },
    { label: "Delivered", status: "delivered", count: stats.delivered || 0, icon: CheckCircle },
  ];

  return (
    <div className="p-4 bg-slate-50">
      <h2 className="text-2xl font-semibold">Orders</h2>
      <p className="text-muted-foreground mb-6">Track and manage customer orders</p>

      {/* STATUS CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        {statusCards.map((item) => (
          <div
            key={item.status}
            onClick={() => setStatusFilter(item.status)}
            className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all duration-200 bg-white hover:shadow-lg`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`p-3 rounded-lg ${STATUS_COLORS[item.status]} flex items-center justify-center`}
              >
                <item.icon className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-md text-gray-500">{item.label}</span>
                <span className="text-2xl font-semibold">{item.count}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* SEARCH + FILTER */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6 bg-white py-5 px-4 border border-gray-200 rounded-xl">
        <div className="flex-1">
          <SearchInputApi
            onResults={(text) => {
              setSearchText(text);
              setPage(1);
            }}
            className="bg-gray-100"
          />
        </div>
        <select
          className="border rounded px-3 py-2 w-full sm:w-[180px] bg-gray-100 cursor-pointer"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
        >
          <option value="all">All Status</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* ORDERS TABLE */}
      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 border-b">
            <tr className="text-base">
              <th className="p-3 text-left font-semibold">Order ID</th>
              <th className="p-3 text-left font-semibold">Customer</th>
              <th className="p-3 text-center font-semibold">Date</th>
              <th className="p-3 text-center font-semibold">Total</th>
              <th className="p-3 text-center font-semibold">Status</th>
              <th className="p-3 text-center font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="p-6 text-center text-muted-foreground">
                  <LoadingSpot text="Loading Order"/>
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-6 text-center text-muted-foreground">
                  No orders found
                </td>
              </tr>
            ) : (
              orders.map((o) => (
                <tr key={o.id} className="border-b hover:bg-gray-50 transition cursor-default">
                  <td className="p-3 font-medium">{o.id}</td>
                  <td className="p-3">
                    <p className="font-medium">{o.fullName}</p>
                    <p className="text-xs text-muted-foreground">{o.email}</p>
                  </td>
                  <td className="p-3 text-center">{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td className="p-3 text-center">${o.totalPrice}</td>
                  <td className="p-3 text-center ">
                    {editingOrderId === o.id ? (
                      <select
                        className={`px-3 py-1 rounded-full text-sm font-semibold cursor-pointer`}
                        value={o.status}
                        onChange={(e) => handleStatusChange(o.id, e.target.value)}
                        onBlur={() => setEditingOrderId(null)}
                        autoFocus
                      >
                        {STATUS_OPTIONS.map((status) => (
                          <option key={status} value={status} >
                            {status}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[o.status]}`}
                      >
                        {o.status}
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-center">
                    <button
                      className="inline-flex items-center gap-1 text-primary hover:underline text-sm cursor-pointer"
                      onClick={() => setEditingOrderId(o.id)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <PaginationSection
        pagination={{
          page: pagination.currentPage || 1,
          totalPages: pagination.totalPages || 1,
          totalRecords: pagination.totalOrders || 0,
        }}
        goToPage={setPage}
      />
    </div>
  );
}
