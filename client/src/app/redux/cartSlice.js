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
      let totalBeforeDiscount = 0;
      let totalDiscount = 0;

      state.cart.forEach((item) => {
        const {
          price,
          qty,
          stock,
          trade_offer_min_qty,
          trade_offer_get_qty,
          discount,
          discount_or_trade_offer_start_date,
          discount_or_trade_offer_end_date,
        } = item;

        // Validate stock
        if (qty > stock) {
          console.warn(
            `Quantity for ${item.name} exceeds stock! Adjusting to max available stock (${stock}).`
          );
          item.qty = stock;
        }

        const offerActive =
          new Date() >= new Date(discount_or_trade_offer_start_date) &&
          new Date() <= new Date(discount_or_trade_offer_end_date);

        const basePrice = price * item.qty;

        let bonusQty = 0;
        if (offerActive && qty >= trade_offer_min_qty) {
          const sets = Math.floor(qty / trade_offer_min_qty);
          bonusQty = sets * trade_offer_get_qty;
        }

        const itemDiscount = offerActive ? discount * qty : 0;

        const finalPrice = basePrice - itemDiscount;

        totalBeforeDiscount += basePrice;
        totalDiscount += itemDiscount;

        item.finalPrice = finalPrice;
        item.totalQty = qty + bonusQty;
      });

      state.total = totalBeforeDiscount;
      state.totalDiscount = totalDiscount;
      state.totalPayable = totalBeforeDiscount - totalDiscount;
    },
  },
});

export const { addToCart, updateQuantity, removeFromCart, calculateTotal } =
  cartSlice.actions;

export default cartSlice.reducer;
