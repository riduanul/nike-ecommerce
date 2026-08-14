import { createSlice } from "@reduxjs/toolkit";
import { toast } from 'react-hot-toast';

const cartFromStorage = localStorage.getItem('nikeCart')
  ? JSON.parse(localStorage.getItem('nikeCart'))
  : [];

const initialState = {
  cartState: false,
  cartItems: cartFromStorage,
  cartTotalAmount: 0,
  cartTotalQuantity: 0,
};

const CartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setOpenCart: (state) => {
      state.cartState = true;
    },
    setCloseCart: (state) => {
      state.cartState = false;
    },
    setAddItemToCart: (state, action) => {
      const itemIndex = state.cartItems.findIndex(
        (item) => item.id === action.payload.id || item._id === action.payload._id
      );
      if (itemIndex >= 0) {
        state.cartItems[itemIndex].cartQuantity += 1;
        toast.success(`Increased ${action.payload.title} quantity`);
      } else {
        const temp = { 
          ...action.payload, 
          id: action.payload.id || action.payload._id,
          cartQuantity: 1 
        };
        state.cartItems.push(temp);
        toast.success(`${action.payload.title} added to Cart`);
      }
      localStorage.setItem('nikeCart', JSON.stringify(state.cartItems));
    },
    setRemoveItemFromCart: (state, action) => {
      const targetId = action.payload.id || action.payload._id;
      const removeItem = state.cartItems.filter(
        (item) => (item.id || item._id) !== targetId
      );
      state.cartItems = removeItem;
      localStorage.setItem('nikeCart', JSON.stringify(state.cartItems));
      toast.success(`${action.payload.title} removed from Cart`);
    },
    setIncreaseItemQTY: (state, action) => {
      const targetId = action.payload.id || action.payload._id;
      const itemIndex = state.cartItems.findIndex(
        (item) => (item.id || item._id) === targetId
      );
      if (itemIndex >= 0) {
        state.cartItems[itemIndex].cartQuantity += 1;
      }
      localStorage.setItem('nikeCart', JSON.stringify(state.cartItems));
    },
    setDecreaseItemQTY: (state, action) => {
      const targetId = action.payload.id || action.payload._id;
      const itemIndex = state.cartItems.findIndex(
        (item) => (item.id || item._id) === targetId
      );
      if (state.cartItems[itemIndex].cartQuantity > 1) {
        state.cartItems[itemIndex].cartQuantity -= 1;
      } else {
        const removeItem = state.cartItems.filter(
          (item) => (item.id || item._id) !== targetId
        );
        state.cartItems = removeItem;
        toast.success(`${action.payload.title} removed from Cart`);
      }
      localStorage.setItem('nikeCart', JSON.stringify(state.cartItems));
    },
    setClearCartItems: (state) => {
      state.cartItems = [];
      localStorage.setItem('nikeCart', JSON.stringify(state.cartItems));
      toast.success("Cart cleared");
    },
    setGetTotals: (state) => {
      let { totalAmount, totalQTY } = state.cartItems.reduce(
        (cartTotal, cartItem) => {
          const { price, cartQuantity } = cartItem;
          const itemTotal = Number(price) * cartQuantity;
          cartTotal.totalAmount += itemTotal;
          cartTotal.totalQTY += cartQuantity;
          return cartTotal;
        },
        {
          totalAmount: 0,
          totalQTY: 0,
        }
      );
      state.cartTotalAmount = totalAmount;
      state.cartTotalQuantity = totalQTY;
    },
  },
});

export const {
  setOpenCart,
  setCloseCart,
  setAddItemToCart,
  setRemoveItemFromCart,
  setIncreaseItemQTY,
  setDecreaseItemQTY,
  setClearCartItems,
  setGetTotals,
} = CartSlice.actions;

export default CartSlice.reducer;