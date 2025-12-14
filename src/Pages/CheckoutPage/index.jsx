import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { clearCart } from "@/Redux/cartSlice/cartSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useApiResponse } from "@/hooks/ResponseApiHook";

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const { fetchApi: apiResponse } = useApiResponse({
    method: "post",
    reduxAction: clearCart,
  });

  const cartItems = useSelector((state) => state.cart.items);
  const cartTotal = useSelector((state) => state.cart.totalPrice);

  const [formData, setFormData] = useState({
    fullName: "",
    company: "",
    address: "",
    apartment: "",
    city: "",
    phone: "",
    email: "",
    postalCode: "",
  });

  const [orderSuccess, setOrderSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckout = async () => {
    if (!cartItems.length) return alert("Cart is empty!");

    setLoading(true);

    const payload = {
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      postalCode: formData.postalCode,
      totalPrice: cartTotal,
      orderItems: cartItems.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
      })),
    };

    try {
      const response = await apiResponse({}, "/order/create", payload);

      if (response?.success) {
        setOrderSuccess(response.data);
        dispatch(clearCart());
      }
    } catch (error) {
      console.error("Checkout failed:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-container flex flex-col md:flex-row gap-10 py-10">

      {/* LEFT — Billing Details (60%) */}
      <div className="md:w-3/5">
        <h2 className="text-2xl font-bold mb-6">Billing Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Full Name */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Full Name *</label>
            <Input
              className="h-11 rounded-lg"
              placeholder="Enter your full name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>

          {/* Company Name */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Company Name</label>
            <Input
              className="h-11 rounded-lg"
              placeholder="Optional"
              name="company"
              value={formData.company}
              onChange={handleChange}
            />
          </div>

          {/* Street Address */}
          <div className="flex flex-col md:col-span-2">
            <label className="text-sm font-medium mb-1">Street Address *</label>
            <Input
              className="h-11 rounded-lg"
              placeholder="House number, street name"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          {/* Apartment */}
          <div className="flex flex-col md:col-span-2">
            <label className="text-sm font-medium mb-1">Apartment, floor, etc. (optional)</label>
            <Input
              className="h-11 rounded-lg"
              placeholder="Apartment / Suite"
              name="apartment"
              value={formData.apartment}
              onChange={handleChange}
            />
          </div>

          {/* City */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Town / City *</label>
            <Input
              className="h-11 rounded-lg"
              placeholder="City name"
              name="city"
              value={formData.city}
              onChange={handleChange}
            />
          </div>

          {/* Phone */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Phone Number *</label>
            <Input
              className="h-11 rounded-lg"
              placeholder="03XX-XXXXXXX"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Email Address *</label>
            <Input
              className="h-11 rounded-lg"
              placeholder="email@example.com"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          {/* Postal Code */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Postal Code *</label>
            <Input
              className="h-11 rounded-lg"
              placeholder="Zip / Postal code"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
            />
          </div>

          {/* Save Info */}
          <div className="flex items-center gap-2 md:col-span-2 mt-2">
            <input type="checkbox" className="w-4 h-4" />
            <p className="text-sm text-gray-600">
              Save this information for faster check-out next time
            </p>
          </div>

        </div>
      </div>

      {/* RIGHT — ORDER SUMMARY (40%) */}
      <div className="md:w-2/5">
        <Card className="shadow-lg p-5">
          <CardHeader className="p-0 mb-4">
            <CardTitle className="text-xl font-semibold">Your Order</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">

            {/* ITEMS */}
            {cartItems?.length ? (
              cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center pb-3 border-b">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.product.images[0].url}
                      alt={item.product.name}
                      className="w-14 h-14 object-cover rounded-md"
                    />
                    <div>
                      <span className="line-clamp-1">{item.product.name}</span> <span> × {item.quantity}</span>
                    </div>
                  </div>
                  <span className="font-medium">
                    Rs {item.product.price * item.quantity}
                  </span>
                </div>
              ))
            ) : (
              <p>No items in cart</p>
            )}

            {/* Subtotal */}
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span>Rs {cartTotal}</span>
            </div>

            {/* Shipping */}
            <div className="flex justify-between text-sm border-b pb-3">
              <span>Shipping:</span>
              <span className="text-green-600 font-medium">Free</span>
            </div>

            {/* Total */}
            <div className="flex justify-between text-xl font-bold">
              <span>Total:</span>
              <span>Rs {cartTotal}</span>
            </div>

            {/* PAYMENT OPTIONS */}
            <div className="mt-4 space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="radio" name="payment" className="accent-red-500" />
                <span>Bank</span>
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Visa_logo.svg/1024px-Visa_logo.svg.png"
                  className="w-10 ml-auto"
                />
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input type="radio" name="payment" defaultChecked className="accent-red-500" />
                <span>Cash on Delivery</span>
              </label>
            </div>

            {/* Coupon */}
            <div className="flex gap-3 mt-4">
              <Input placeholder="Coupon Code" className="h-10" />
              <Button className="bg-gray-800 hover:bg-black">Apply</Button>
            </div>

            {/* Place Order */}
            <Button
              className="w-full bg-red-500 hover:bg-red-600 mt-4"
              onClick={handleCheckout}
              disabled={loading}
            >
              {loading ? "Placing Order..." : "Place Order"}
            </Button>

            {/* SUCCESS */}
            {orderSuccess && (
              <div className="mt-4 p-4 bg-green-100 text-green-700 rounded">
                <h2 className="font-semibold">Order Placed Successfully!</h2>
                <p>Order ID: {orderSuccess.id}</p>
                <p>Total Price: Rs {orderSuccess.totalPrice}</p>
              </div>
            )}

          </CardContent>
        </Card>
      </div>

    </div>
  );
}
