import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  totalQuantity: 0,
  totalPrice: 0,
};

// calculateTotals
const calculateTotals = (state) => {
  state.totalQuantity = state.items.reduce((sum, i) => sum + i.quantity, 0);
  state.totalPrice = state.items.reduce(
    (sum, i) => sum + (i.product?.price || 0) * i.quantity,
    0
  );
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
    existing.quantity = item.quantity;
  } else {
    state.items.push({ ...item, quantity: item.quantity });
  }
      calculateTotals(state);
    },


    
    // handle increment quantity

    incrementQuantity(state, action) {
      const { id, productId } = action.payload;
      const item = state.items.find((i) => i.product.id === productId);
      if (!item) return;
      item.quantity++;
      calculateTotals(state);
    },
    // decrement Quantity
    decrementQuantity(state, action) {
      const { productId } = action.payload;
      const item = state.items.find((i) => i.product.id === productId);
      if (!item) return;

      item.quantity--;

      if (item.quantity <= 0) {
        state.items = state.items.filter((i) => i.product.id !== productId);
      }

      calculateTotals(state);
    },
    // remove item from cart
    removeCart(state, action) {
      const { id } = action.payload;
      state.items = state.items.filter((item) => item.id !== id);
      calculateTotals(state);
    },

    // remove selected items
    removeSelectedItems(state, action) {
      const ids = action.payload.deletedIds;
      if (!ids || !Array.isArray(ids)) return;

      state.items = state.items.filter((i) => !ids.includes(i.id));
      calculateTotals(state);
    },

    // get all cart
    setCart(state, action) {
      state.items = action.payload.cartItems || [];
      calculateTotals(state);
    },
    // clear Cart
    clearCart(state) {
      state.items = [];
      state.totalPrice = 0;
      state.totalQuantity=0
    },
  },
});
export const {
  setCart,
  clearCart,
  addToCart,
  removeCart,
  incrementQuantity,
  decrementQuantity,
  removeSelectedItems,
} = cartSlice.actions;

export default cartSlice.reducer;
