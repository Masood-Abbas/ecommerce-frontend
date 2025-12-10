import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import OrderCardItem from "./orderCard";


const OrderCard = ({orders, data, setActiveTab }) => {

  console.log("orders cards",orders)
  
  return (
    <Card className="shadow rounded-xl">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className="text-lg">Orders</CardTitle>

       {data && <Button
          onClick={() => setActiveTab("orders")}
          className="bg-(--primary-color) hover:bg-(--hover-primary-color) text-white text-sm"
        >
          {data}
        </Button>}
      </CardHeader>

      <CardContent>
        {orders?.length > 0 ? (
          orders.map((order) => <OrderCardItem key={order.id} order={order} />)
        ) : (
          <p className="text-gray-500 text-sm">No orders found.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderCard;
