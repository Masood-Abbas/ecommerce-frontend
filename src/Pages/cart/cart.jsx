import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, Trash2 } from "lucide-react";

import { useApiResponse } from "@/hooks/ResponseApiHook";
import {
  addToCart,
  decrementQuantity,
  removeCart,
  removeSelectedItems,
  setCart,
} from "@/Redux/cartSlice/cartSlice";

export default function CartPage() {
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

  const { fetchApi: incrementApi } = useApiResponse({
    method: "post",
    isToast: true,
    reduxAction: addToCart,
  });

  const handleIncrement = async (id) => {
    await incrementApi({}, `/cart/create/${id}`);
  };

  const { fetchApi: decrementApi } = useApiResponse({
    method: "delete",
    isToast: true,
    reduxAction: decrementQuantity,
  });

  const handleDecrement = async (id) => {
    await decrementApi({}, `/cart/removefromcartItemQuantity/${id}`);
  };

  const { fetchApi: removeSingleCartApi } = useApiResponse({
    method: "delete",
    isToast: true,
    reduxAction: removeCart,
  });

  const handleRemove = async (id) => {
    await removeSingleCartApi({}, `/cart/removefromcart/${id}`);
  };

  const { fetchApi: removeSelectedApi } = useApiResponse({
    method: "delete",
    isToast: true,
    reduxAction: removeSelectedItems,
  });

  const handleRemoveSelected = async () => {
    if (selectedIds.length === 0) return;
    await removeSelectedApi({}, `/cart/removecart`, { itemIds: selectedIds });
    setSelectedIds([]);
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === items.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(items.map((item) => item.id));
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-4 text-gray-800">Your Cart</h1>

      {/* Action Buttons */}
      <div className="flex justify-between items-center mb-6">
        <Button
          variant="outline"
          onClick={toggleSelectAll}
          className="px-4 py-2"
        >
          {selectedIds.length === items.length ? "Deselect All" : "Select All"}
        </Button>

        <Button
          variant="destructive"
          onClick={handleRemoveSelected}
          disabled={selectedIds.length === 0}
          className="px-4 py-2"
        >
          Remove Selected
        </Button>
      </div>

      {items.length === 0 ? (
        <p className="text-center text-lg text-gray-500 mt-12">
          Your cart is empty.
        </p>
      ) : (
        <div className="space-y-5">
          {items.map((item) => (
            <Card
              key={item.id}
              className="flex flex-col md:flex-row justify-between items-center p-4 rounded-3xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              {/* Checkbox */}
              <input
                type="checkbox"
                checked={selectedIds.includes(item.id)}
                onChange={() => toggleSelect(item.id)}
                className="w-5 h-5 mr-4"
              />

              {/* Product Info */}
              <div className="flex items-center gap-4 flex-1">
                <img
                  src={`${import.meta.env.VITE_API_BASE_URL}${item.product.image}`}
                  alt={item.product.name}
                  className="w-24 h-24 object-cover rounded-2xl border border-gray-200"
                />
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {item.product.name}
                  </h2>
                  <p className="text-gray-500 mt-1">${item.product.price}</p>
                </div>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-2 mt-4 md:mt-0">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleDecrement(item.productId)}
                  className="rounded-xl p-2"
                >
                  <Minus className="w-5 h-5" />
                </Button>

                <span className="text-lg font-semibold w-10 text-center">
                  {item.quantity}
                </span>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleIncrement(item.productId)}
                  className="rounded-xl p-2"
                >
                  <Plus className="w-5 h-5" />
                </Button>

                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleRemove(item.id)}
                  className="rounded-xl p-2 ml-4"
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
              </div>
            </Card>
          ))}

          <Separator className="my-6" />

          {/* Order Summary */}
          <Card className="rounded-3xl shadow-lg p-6 bg-gray-50">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-800">
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="mt-2">
              <div className="flex justify-between text-lg font-semibold mb-4">
                <span>Total:</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <Button className="w-full py-4 text-lg font-semibold rounded-2xl bg-blue-600 hover:bg-blue-700 text-white">
                Checkout
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
