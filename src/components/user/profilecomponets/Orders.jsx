import { Card, CardContent } from "@/components/ui/card";

export default function Orders() {
  return (
    <Card className="shadow-lg mb-6">
      <CardContent className="py-6">
        <h2 className="text-lg font-semibold mb-4">My Orders</h2>

        <p className="text-gray-600">No orders found.</p>
      </CardContent>
    </Card>
  );
}
