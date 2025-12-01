import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  totalQuantity: 0,
  totalPrice: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // add to cart
    addToCart(state, action) {
      const item = action.payload;
      const existing = state.items.find((i) => i.id === item.id);

      if (existing) {
        existing.quantity++;
      } else {
        state.items.push({ ...item, quantity: 1 });
      }
      state.totalQuantity++;
    },

    // handle increment quantity

    incrementQuantity(state, action) {
      const { id, productId } = action.payload;
      const item = state.items.find((i) => i.product.id === productId);
      if (!item) return;
      item.quantity++;
      state.totalQuantity = state.items.reduce((sum, i) => sum + i.quantity, 0);
      state.totalPrice = state.items.reduce(
        (sum, i) => sum + (i.product?.price || 0) * i.quantity,
        0
      );
    },
    // decrement Quantity
    decrementQuantity(state, action) {
      const { id, productId } = action.payload;
      const item = state.items.find((i) => i.product.id === productId);
      if (!item) return; 
      if (item.quantity > 1) {
        item.quantity--;
        console.log(" item.quantity", item.quantity)
      } else {
        console.log(" item.quantity", item.quantity)
        state.items = state.items.filter((i) => i.product.id !== productId);
      }
      state.totalQuantity = state.items.reduce((sum, i) => sum + i.quantity, 0);
      state.totalPrice = state.items.reduce(
        (sum, i) => sum + (i.product?.price || 0) * i.quantity,
        0
      );
    },

    // get all cart
    setCart(state, action) {
      state.items = action.payload.cartItems || [];
      state.totalQuantity = action.payload.totalQuantity || 0;
      state.totalPrice = state.items.reduce(
        (sum, i) => sum + i.product.price * i.quantity,
        0
      );
    },
  },
});
export const { addToCart, setCart, incrementQuantity,decrementQuantity } = cartSlice.actions;

export default cartSlice.reducer;
