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
        (sum, i) =>{console.log("sum",sum)
          return sum + (i.product?.price || 0) * i.quantity},
        0
      );
    },
    // decrement Quantity
    decrementQuantity(state, action) {
      const {  productId } = action.payload;
      const item = state.items.find((i) => i.product.id === productId);
      if (!item) return;

      item.quantity--;

      if (item.quantity <= 0) {
       
        state.items = state.items.filter((i) => i.product.id !== productId);
      }
      
      state.totalQuantity = state.items.reduce((sum, i) => sum + i.quantity, 0);
      state.totalPrice = state.items.reduce(
        (sum, i) => sum + (i.product?.price || 0) * i.quantity,
        0
      );
    },
    // remove item from cart
    removeCart(state,action){
      const {id}=action.payload
      state.items=state.items.filter((item)=>item.id!==id)
      state.totalQuantity = state.items.reduce((sum, i) => sum + i.quantity, 0);
      state.totalPrice = state.items.reduce(
        (sum, i) => sum + (i.product?.price || 0) * i.quantity,
        0
      );
    },

// remove selected items
removeSelectedItems(state, action) {
  const ids = action.payload.deletedIds;
  if (!ids || !Array.isArray(ids)) return;

  state.items = state.items.filter((i) => !ids.includes(i.id));

  state.totalQuantity = state.items.reduce((sum, i) => sum + i.quantity, 0);
  state.totalPrice = state.items.reduce((sum, i) => sum + (i.price || 0) * i.quantity, 0);
},



    // get all cart
    setCart(state, action) {
      state.items = action.payload.cartItems || [];
      state.totalQuantity = state.items.reduce((sum, i) => sum + i.quantity, 0);
      state.totalPrice = state.items.reduce(
        (sum, i) => sum + i.product.price * i.quantity,
        0
      );
    },
  },
});
export const { addToCart, setCart, incrementQuantity, decrementQuantity,removeCart,removeSelectedItems } =
  cartSlice.actions;

export default cartSlice.reducer;
