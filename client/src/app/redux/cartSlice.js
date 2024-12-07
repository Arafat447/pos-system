import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: [],
  total: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const existingProduct = state.cart.find((item) => item.id === product.id);
      if (existingProduct) {
        existingProduct.qty += 1;
      } else {
        state.cart.push({ ...product, qty: 1 });
      }
    },
    updateQuantity: (state, action) => {
      const { id, qty } = action.payload;
      const product = state.cart.find((item) => item.id === id);
      if (product) {
        product.qty = qty > 0 ? qty : 1;
      }
    },
    removeFromCart: (state, action) => {
      const id = action.payload;
      state.cart = state.cart.filter((item) => item.id !== id);
    },
    calculateTotal: (state) => {
      state.total = state.cart.reduce(
        (total, item) => total + item.price * item.qty,
        0
      );
    },
  },
});

export const { addToCart, updateQuantity, removeFromCart, calculateTotal } =
  cartSlice.actions;

export default cartSlice.reducer;
