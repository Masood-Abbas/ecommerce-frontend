import { Button } from "@/components/ui/button";
import LoadingSpot from "@/components/ui/spinner/loadingSpiner";
import { useApiResponse } from "@/hooks/ResponseApiHook";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RecentOrders=({url}) =>{
  const navigate=useNavigate()
  // fetch data
  const { fetchApi, data, loading } = useApiResponse({
    endpoint: url || "/order/getshoporder",
    method: "get",
  });

  useEffect(() => {
    fetchApi();
  }, []);

  const orders = data?.orders || [];
  // handle view
  const handleView=()=>{
    navigate("/vendor/orders")
  }

  return (
    <div className="bg-white rounded-xl border shadow-sm">
      {/* Header */}
      <div className="flex justify-between px-6 py-4 border-b">
        <div>
          <h2 className="text-lg font-semibold">Recent Orders</h2>
          <p className="text-sm text-slate-500">Latest customer orders</p>
        </div>
        <Button className="text-sm  font-medium cursor-pointer" onClick={handleView} >
          View All
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm cursor-default">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-6 py-3 text-left">ORDER ID</th>
              <th className="px-6 py-3 text-left">CUSTOMER</th>
              <th className="px-6 py-3 text-left">DATE</th>
              <th className="px-6 py-3 text-left">ITEMS</th>
              <th className="px-6 py-3 text-left">TOTAL</th>
              <th className="px-6 py-3 text-left">STATUS</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {loading && (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center">
                 <LoadingSpot text="Loading order"/>
                </td>
              </tr>
            )}

            {!loading && orders.length === 0 && (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center">
                  No orders found
                </td>
              </tr>
            )}

            {!loading &&
              orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4">{`Order-${order.id}`}</td>
                  <td className="px-6 py-4">
                    {order.customer?.name || "N/A"}
                  </td>
                  <td className="px-6 py-4">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    {order.items?.length || 0} items
                  </td>
                  <td className="px-6 py-4 font-medium">
                    ${order.totalPrice}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 text-xs rounded-full ${
                        order.status === "completed"
                          ? "bg-emerald-100 text-emerald-600"
                          : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default  RecentOrders