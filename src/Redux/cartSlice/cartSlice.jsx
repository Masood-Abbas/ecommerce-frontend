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
    addToCart(state, action) {
      const item = action.payload;
      const existing = state.items.find((i) => i.id === item.id);

      if (existing) {
        existing.quantity++;
      } else {
        state.items.push({ ...item, quantity: 1 });
      }
      state.totalQuantity++;
      state.totalPrice += item.price;
    },
  },
});
export const { addToCart } = cartSlice.actions;

export default cartSlice.reducer;
