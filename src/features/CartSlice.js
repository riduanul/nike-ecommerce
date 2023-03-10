import { createSlice } from "@reduxjs/toolkit";
import {toast} from 'react-hot-toast'

const initialState = {
    cartState: false,
    cartItems: [],
}

const CartSlice = createSlice({
    name: "cart",
    initialState,
    reducers:{
        setOpenCart: (state, action) => {
                state.cartState = action.payload.cartState;
        },
        setCloseCart: (state, action) => {
            state.cartState = action.payload.cartState;
        },
        setAddItemToCart : (state, action) => {
            const itemIndex = state.cartItems.findIndex((item)=>(
                    item.id === action.payload.id
            ))
            if(itemIndex >= 0) {
                    state.cartItems[itemIndex].cartQuantity += 1;
            }else{
                const temp = {...action.payload, cartQuantity: 1}
                state.cartItems.push(temp)
            }
           toast.success(`${action.payload.title} added to Cart`)
        }
    }

})

export const  {setOpenCart, setCloseCart, setAddItemToCart} = CartSlice.actions;

export default CartSlice.reducer;