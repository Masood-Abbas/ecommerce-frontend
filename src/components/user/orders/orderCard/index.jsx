import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const OrderCardItem = ({ order }) => {
  const totalItems = order?.orderItems?.reduce(
    (sum, item) => sum + (item.quantity || 0),
    0
  ) || 0;

  return (
    <Card className="border shadow-sm mb-4 rounded-xl hover:shadow-md transition">
      <CardContent >
        <div className="flex justify-between items-center">
          <div>
            <p className="font-medium text-base">Order-{order?.id || "N/A"}</p>
            <p className="text-gray-500 text-sm">
              {order?.createdAt
                ? new Date(order.createdAt).toLocaleDateString()
                : "Date N/A"}
            </p>
          </div>
        </div>

        <div className="mt-3">
          {order?.orderItems && order.orderItems.length > 0 ? (
            order.orderItems.map((item) => (
              <div key={item.id} className="text-sm text-gray-700 mb-1 flex flex-row flex-wrap">
               <span className="bg-gray-100 p-1 px-2 rounded-xl"> {item.product?.name || "Unnamed Product"} x {item.quantity || 0}</span>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No items in this order.</p>
          )}
        </div>

        <div className="flex justify-between mt-3">
          <Badge variant="outline" className="text-xs px-2 py-1">
            {totalItems} {totalItems === 1 ? "item" : "items"}
          </Badge>
          <p className="font-semibold">Rs {order?.totalPrice || 0}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderCardItem;
