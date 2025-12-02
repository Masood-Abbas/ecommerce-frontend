import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCartActions } from "@/hooks/cart/useCart";

export default function CartPage() {
  const { items, totalPrice } = useSelector((state) => state.cart);
  const [selectedIds, setSelectedIds] = useState([]);

  const {
    fetchCart,
    handleIncrement,
    handleDecrement,
    handleRemove,
    handleRemoveSelected,
  } = useCartActions();

  useEffect(() => {
    fetchCart();
  }, []);

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-[#111]">
        My Cart
      </h1>

      {items.length === 0 ? (
        <p className="text-lg text-center text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT TABLE */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Total {items.length} item{items.length > 1 ? "s" : ""}
              </p>

              <Button
                variant="destructive"
                onClick={() =>
                  handleRemoveSelected(selectedIds, () => setSelectedIds([]))
                }
                disabled={selectedIds.length === 0}
              >
                clear cart
              </Button>
            </div>

            <Card className="rounded-xl shadow-sm border">

              {/* ⭐ Scroll only on small screens */}
              <div className="overflow-x-auto md:overflow-visible">
                <div className="max-md:min-w-[750px]">
                  <Table>
                    <TableHeader className="bg-gray-100 text-gray-700">
                      <TableRow>
                        <TableHead className="w-10"></TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead className="text-center">Price</TableHead>
                        <TableHead className="text-center">Qty</TableHead>
                        <TableHead className="text-center">Subtotal</TableHead>
                        <TableHead className="text-center">Remove</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {items.map((item) => (
                        <TableRow key={item.id} className="hover:bg-gray-50">
                          <TableCell>
                            <input
                              type="checkbox"
                              checked={selectedIds.includes(item.id)}
                              onChange={() => toggleSelect(item.id)}
                              className="w-4 h-4"
                            />
                          </TableCell>

                          <TableCell className="py-3">
                            <div className="flex items-center gap-3">
                              <img
                                src={`${import.meta.env.VITE_API_BASE_URL}${item.product.image}`}
                                alt={item.product.name}
                                className="w-14 h-14 md:w-20 md:h-20 object-cover rounded-lg border"
                              />

                              <p className="font-medium text-[#111] text-sm md:text-base">
                                {item.product.name}
                              </p>
                            </div>
                          </TableCell>

                          <TableCell className="text-center font-medium text-[#111]">
                            ${item.product.price}
                          </TableCell>

                          <TableCell>
                            <div className="flex items-center justify-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleDecrement(item.productId)}
                                disabled={item.quantity === 1}
                                className="rounded-lg h-8 w-8"
                              >
                                <Minus className="w-4 h-4" />
                              </Button>

                              <span className="text-lg font-semibold w-8 text-center text-[#111]">
                                {item.quantity}
                              </span>

                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleIncrement(item.productId)}
                                className="rounded-lg h-8 w-8"
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>

                          <TableCell className="text-center font-semibold text-[#111]">
                            ${(item.quantity * item.product.price).toFixed(2)}
                          </TableCell>

                          <TableCell className="text-center">
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() => handleRemove(item.id)}
                              className="rounded-lg h-9 w-9"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </Card>
          </div>

          {/* RIGHT SUMMARY */}
          <Card className="rounded-xl shadow-md border p-4 h-fit">
            <CardHeader>
              <CardTitle className="text-xl md:text-2xl font-bold text-[#111]">
                Order Summary
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="space-y-3 text-gray-600">
                <div className="flex justify-between text-base">
                  <span>Subtotal:</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-semibold text-[#111]">
                  <span>Total:</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <Button className="w-full mt-6 py-4 text-base font-medium bg-[#00A96E] hover:bg-[#00945F] text-white rounded-xl shadow-md">
                Checkout
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
