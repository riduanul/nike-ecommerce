import { configureStore } from "@reduxjs/toolkit";
import CartSlice from "../features/CartSlice.js";
import authReducer from "../features/authSlice.js";
import productReducer from "../features/productSlice.js";
import orderReducer from "../features/orderSlice.js";

const Store = configureStore({
  reducer: {
    cart: CartSlice,
    auth: authReducer,
    products: productReducer,
    orders: orderReducer,
  },
});

export default Store;