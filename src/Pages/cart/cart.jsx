import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, Trash2 } from "lucide-react";

import { useApiResponse } from "@/hooks/ResponseApiHook";
import {
  incrementQuantity,
  decrementQuantity,
  removeCart,
  removeSelectedItems,
  setCart,
} from "@/Redux/cartSlice/cartSlice";

export default function CartPage() {
  const dispatch = useDispatch();
  const { items, totalPrice } = useSelector((state) => state.cart);
  const [selectedIds, setSelectedIds] = useState([]);

  const { fetchApi: fetchCart } = useApiResponse({
    endpoint: "/cart/getcart",
    method: "get",
    isToast: false,
    reduxAction: setCart,
  });

  useEffect(() => {
    fetchCart();
  }, []);

  // Increment quantity
  const { fetchApi: incrementApi } = useApiResponse({
    method: "post",
    isToast: true,
    reduxAction: incrementQuantity,
  });

  const handleIncrement = async (id) => {
    await incrementApi({}, `/cart/create/${id}`);
  };

  // Decrement quantity
  const { fetchApi: decrementApi } = useApiResponse({
    method: "delete",
    isToast: true,
    reduxAction: decrementQuantity,
  });

  const handleDecrement = async (id) => {
    await decrementApi({}, `/cart/removefromcartItemQuantity/${id}`);
  };

  // Remove single item
  const { fetchApi: removeSingleCartApi } = useApiResponse({
    method: "delete",
    isToast: true,
    reduxAction: removeCart,
  });

  const handleRemove = async (id) => {
    await removeSingleCartApi({}, `/cart/removefromcart/${id}`);
  };

  // Remove selected items
  const { fetchApi: removeSelectedApi } = useApiResponse({
    method: "delete",
    isToast: true,
    reduxAction: removeSelectedItems,
  });

  const handleRemoveSelected = async () => {
    if (selectedIds.length === 0) return;
    await removeSelectedApi({}, `/cart/removecart`,{itemIds: selectedIds });
    setSelectedIds([]); 
  };

  // Toggle selection
  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">Your Cart</h1>

      {/* Remove Selected Button */}
      <div className="flex justify-end mb-4">
        <Button
          variant="destructive"
          onClick={handleRemoveSelected}
          disabled={selectedIds.length === 0}
        >
          Remove Selected
        </Button>
      </div>

      {items.length === 0 ? (
        <p className="text-lg text-center">Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <Card key={item.id} className="rounded-2xl shadow-sm">
              <CardContent className="flex items-center justify-between p-4 gap-4">
                {/* Checkbox */}
                <input
                  type="checkbox"
                  checked={selectedIds.includes(item.id)}
                  onChange={() => toggleSelect(item.id)}
                  className="mr-2"
                />

                {/* Product Info */}
                <div className="flex items-center gap-4">
                  <img
                    src={`${import.meta.env.VITE_API_BASE_URL}${item.product.image}`}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-xl"
                  />
                  <div>
                    <h2 className="text-xl font-semibold">{item.product.name}</h2>
                    <p className="text-sm text-gray-500">${item.product.price}</p>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDecrement(item.productId)}
                    className="rounded-xl"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>

                  <span className="text-lg font-semibold w-8 text-center">
                    {item.quantity}
                  </span>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleIncrement(item.productId)}
                    className="rounded-xl"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>

                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleRemove(item.id)}
                    className="rounded-xl"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          <Separator />

          {/* Order Summary */}
          <Card className="rounded-2xl shadow-md p-4">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between text-lg font-semibold">
                <span>Total:</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <Button className="w-full mt-4 rounded-2xl py-6 text-lg">
                Checkout
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
