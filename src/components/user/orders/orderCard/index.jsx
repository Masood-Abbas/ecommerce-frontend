import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Status to Tailwind class mapping
const STATUS_CLASSES = {
  pending: "border-orange-500 text-orange-600 bg-orange-100",
  processing: "border-blue-500 text-blue-600  bg-blue-100 ",
  shipped: "border-purple-500 text-purple-600  bg-purple-100",
  delivered: "border-green-500 text-green-600  bg-green-100",
  cancelled: "border-red-500 text-red-600  bg-red-100",
  default: "border-gray-500 text-gray-600  bg-gray-100",
};

const OrderCardItem = ({ order }) => {
  const totalItems =
    order?.orderItems?.reduce((sum, item) => sum + (item.quantity || 0), 0) ||
    0;

  // Determine badge classes
  const statusClass = STATUS_CLASSES[order?.status] || STATUS_CLASSES.default;

  return (
    <Card className="border shadow-sm mb-4 rounded-xl hover:shadow-md transition">
      <CardContent>
        {/* Header: Order ID, Date, Status */}
        <div className="flex justify-between items-center">
          <div>
            <p className="font-medium text-base">Order-{order?.id || "N/A"}</p>
            <p className="text-gray-500 text-sm">
              {order?.createdAt
                ? new Date(order.createdAt).toLocaleDateString()
                : "Date N/A"}
            </p>
          </div>

          {/* Order Status Badge */}
          {order?.status && (
            <Badge
              variant="outline"
              className={`text-sm px-2 py-1 capitalize ${statusClass} `}
            >
              {order.status}
            </Badge>
          )}
        </div>

        {/* Order Items */}
        <div className="mt-3">
          {order?.orderItems && order.orderItems.length > 0 ? (
            order.orderItems.map((item) => (
              <div key={item.id} className="flex items-center gap-3 py-3">
                {/* Product Image */}
                <img
                  src={item.product?.images?.[0]?.url || "/no-image.png"}
                  alt="product"
                  className="w-16 h-16 object-cover rounded-md border"
                />

                {/* Product Info */}
                <div className="flex-1">
                  <p className="font-medium text-sm line-clamp-2">
                    {item.product?.name || "Unnamed Product"}
                  </p>
                </div>

                {/* Price & Quantity */}
                <div className="text-right">
                  <p className="font-semibold text-sm">Rs. {item.price}</p>
                  <p className="text-gray-600 text-xs">Qty: {item.quantity}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No items in this order.</p>
          )}
        </div>

        {/* Footer: Total Items & Total Price */}
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
