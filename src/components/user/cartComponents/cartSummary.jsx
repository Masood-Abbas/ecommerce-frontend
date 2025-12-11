import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function CartSummary({ totalPrice }) {
  const navigate=useNavigate()
  const handlePlaceOrder=()=>{
    navigate("/checkout")
  }
  return (
    <Card className="rounded-2xl shadow-md border border-gray-100 p-5 h-fit bg-white/80 backdrop-blur">
      <CardHeader className="px-0">
        <CardTitle className="text-xl  text-black px-0 font-medium font-Inter">
          Cart Total
        </CardTitle>
      </CardHeader>

      <CardContent className="px-0">
        <div className="space-y-4">
          <div className="flex justify-between text-black px-0 text-base">
            <span>Subtotal</span>
            <span >${totalPrice.toFixed(2)}</span>
          </div>

          <Separator />

          <div className="flex justify-between font-medium  text-base">
            <span>Total</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>

          <Button className="w-full mt-6 py-5 rounded-sm bg-[#DB4444] hover:bg-[#E07575]
           text-white" onClick={handlePlaceOrder}>
            Place Order
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
