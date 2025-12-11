import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const OrderCardItem = ({ order }) => {
  const totalItems =
    order?.orderItems?.reduce((sum, item) => sum + (item.quantity || 0), 0) ||
    0;

    console.log("order?.orderItems",order)

  return (
    <Card className="border shadow-sm mb-4 rounded-xl hover:shadow-md transition">
      <CardContent>
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
              <div
                key={item.id}
                className="flex items-center gap-3 py-3"
              >
                {/* Image */}
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

                {/* Price & Qty */}
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
