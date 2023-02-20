import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setCloseCart } from '../features/cartSlice.js'
import CartCount from './Cart/CartCount'
import CartEmpty from './Cart/CartEmpty'
import CartItem from './Cart/CartItem'

const Cart = () => {
  
  const dispatch = useDispatch()
  const {cartState} = useSelector(state => state.cart)

  const onCartToggle = ()=> {
    dispatch(setCloseCart({
        cartState:false
    }))
}
  return (
    <>
        <div className={` fixed top-0 left-0 right-0 blur-effect-theme w-full h-screen opacity-100 z-[250] ${cartState ? 'opacity-100 visible translate-x-0' : 'opacity-0 invisible translate-x-8'}`}>
            <div className={`blur-effect-theme h-screen max-w-xl w-full absolute right-0`}>
                <CartCount onCartToggle={onCartToggle}/>
                <CartEmpty/>
                <CartItem/>
            </div>
        </div>
    </>
  )
}

export default Cart