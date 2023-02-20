import { configureStore } from "@reduxjs/toolkit";
import cartSlice from "../features/cartSlice.js";


const Store = configureStore({
    reducer:{
        cart: cartSlice,
    },
  //   devTools: process.env.NODE_ENV !== 'production',
  // middleware: (getDefaultMiddlewares) => getDefaultMiddlewares().concat(), 
})

export default Store