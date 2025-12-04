import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export default function CartSummary({ totalPrice }) {
  return (
    <Card className="rounded-2xl shadow-md border border-gray-100 p-5 h-fit bg-white/80 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-gray-900">
          Order Summary
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between text-gray-700">
            <span>Subtotal</span>
            <span className="font-medium">${totalPrice.toFixed(2)}</span>
          </div>

          <Separator />

          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>

          <Button className="w-full mt-6 py-3 rounded-xl bg-[#00A96E] hover:bg-[#00945F] text-white">
            Checkout
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
