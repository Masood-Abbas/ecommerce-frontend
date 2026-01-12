import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  bestSellingProducts: [],
  allProducts: [],
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setBestSellingProducts: (state, action) => {
      // Ensure it's always an array
      state.bestSellingProducts = Array.isArray(action.payload)
        ? action.payload
        : [];
    },
    setAllProducts: (state, action) => {
      state.allProducts = Array.isArray(action.payload)
        ? action.payload
        : [];
    },
    appendAllProducts: (state, action) => {
      const newItems = Array.isArray(action.payload) ? action.payload : [];
      const existingIds = new Set(state.allProducts.map((p) => p.id));
      const filtered = newItems.filter((p) => !existingIds.has(p.id));
      state.allProducts.push(...filtered);
    },
  },
});

export const { setBestSellingProducts, setAllProducts, appendAllProducts } =
  productSlice.actions;

export default productSlice.reducer;
