import React, { useState } from "react";
import { useSelector } from "react-redux";

import { useCartActions } from "@/hooks/cart/useCart";
import CartItems from "@/components/user/cartComponents/cartItems";
import CartSummary from "@/components/user/cartComponents/cartSummary";

export default function CartPage() {
  const { items, totalPrice } = useSelector((state) => state.cart);
  const [selectedIds, setSelectedIds] = useState([]);
  console.log("items",items)
  console.log("totalPrice",totalPrice)

  const {
    handleIncrement,
    handleDecrement,
    handleRemove,
    handleRemoveSelected,
    fetchLoading,
    fetchError,
  } = useCartActions();

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="main-container py-6">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-[#111] tracking-tight">
        My Cart
      </h1>

      {/* Loading */}
      {fetchLoading && (
        <div className="text-center py-10 text-gray-500 text-lg">
          Loading your cart…
        </div>
      )}

      {/* Error */}
      {fetchError && (
        <div className="text-center py-10 text-red-500 text-lg">
          Failed to load cart: {fetchError}
        </div>
      )}

      {!fetchLoading && !fetchError && items.length === 0 && (
        <p className="text-center text-gray-600 text-lg py-10">
          Your cart is empty.
        </p>
      )}

      {/* MAIN CART UI */}
      {!fetchLoading && !fetchError && items.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <CartItems
            items={items}
            selectedIds={selectedIds}
            toggleSelect={toggleSelect}
            handleIncrement={handleIncrement}
            handleDecrement={handleDecrement}
            handleRemove={handleRemove}
            handleRemoveSelected={handleRemoveSelected}
            setSelectedIds={setSelectedIds}
          />

          <CartSummary totalPrice={totalPrice} />
        </div>
      )}
    </div>
  );
}
