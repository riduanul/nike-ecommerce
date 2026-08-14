import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  setCloseCart,
  setClearCartItems,
  setGetTotals,
} from '../features/CartSlice.js';
import CartCount from './Cart/CartCount';
import CartEmpty from './Cart/CartEmpty';
import CartItem from './Cart/CartItem';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartState, cartItems, cartTotalAmount, cartTotalQuantity } = useSelector(
    (state) => state.cart
  );

  useEffect(() => {
    dispatch(setGetTotals());
  }, [cartItems, dispatch]);

  const onCartToggle = () => {
    dispatch(setCloseCart());
  };

  const onClearCartItems = () => {
    dispatch(setClearCartItems());
  };

  const onCheckout = () => {
    dispatch(setCloseCart());
    navigate('/checkout');
  };

  return (
    <div
      className={`fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-[250] transition-all duration-300 ${
        cartState
          ? 'opacity-100 visible pointer-events-auto bg-black/50 backdrop-blur-sm'
          : 'opacity-0 invisible pointer-events-none'
      }`}
      onClick={onCartToggle}
    >
      <div
        className={`bg-white h-screen max-w-lg w-full absolute right-0 top-0 shadow-2xl flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          cartState ? 'translate-x-0' : 'translate-x-full'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <CartCount
          onCartToggle={onCartToggle}
          totalQTY={cartTotalQuantity}
          onClearCartItems={onClearCartItems}
        />

        {cartItems?.length === 0 ? (
          <CartEmpty onCartToggle={onCartToggle} />
        ) : (
          <>
            <div className="flex-1 overflow-y-auto scroll-style px-2">
              {cartItems?.map((item, i) => (
                <CartItem key={i} item={item} />
              ))}
            </div>

            <div className="sticky bottom-0 bg-white border-t border-slate-200 p-5 shadow-inner">
              <div className="flex items-center justify-between font-semibold text-base mb-1">
                <span className="uppercase text-slate-700">Subtotal</span>
                <span className="text-slate-900 font-bold">${cartTotalAmount.toFixed(2)}</span>
              </div>
              <p className="text-xs text-slate-500 font-normal text-center mb-3">
                Taxes and Shipping Calculated at Checkout
              </p>
              <div className="grid items-center gap-2">
                <button
                  type="button"
                  onClick={onCheckout}
                  className="w-full bg-gradient-to-r from-slate-900 to-black text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-slate-500/50 hover:scale-[1.02] active:scale-95 transition-all text-sm uppercase tracking-wider"
                >
                  Check Out
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;