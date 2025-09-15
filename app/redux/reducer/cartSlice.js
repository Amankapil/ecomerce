import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: [],
  total: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addtocart: (state, action) => {
      const item = action.payload;
      state.cart.push(item);
      state.total += item.price;
      console.log("✅ Item added to cart in reducer:", item);
    },
  },
});

export const { addtocart } = cartSlice.actions;
export default cartSlice.reducer;
