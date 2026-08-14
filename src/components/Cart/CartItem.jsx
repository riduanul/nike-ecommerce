import React from 'react';
import { MinusIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useDispatch } from 'react-redux';
import {
  setDecreaseItemQTY,
  setIncreaseItemQTY,
  setRemoveItemFromCart,
} from '../../features/CartSlice.js';

const CartItem = ({ item: { id, _id, title, text, img, color, shadow, price, cartQuantity } }) => {
  const dispatch = useDispatch();
  const itemId = id || _id;

  const onRemoveItem = () => {
    dispatch(setRemoveItemFromCart({ id: itemId, title }));
  };

  const onIncreaseItemQTY = () => {
    dispatch(setIncreaseItemQTY({ id: itemId }));
  };

  const onDecreaseItemQTY = () => {
    dispatch(setDecreaseItemQTY({ id: itemId, title }));
  };

  return (
    <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 hover:bg-slate-50/50 transition-all duration-300">
      <div className="flex items-center gap-4">
        <div className={`relative bg-gradient-to-b ${color || 'from-blue-600 to-blue-500'} ${shadow || 'shadow-blue-500'} p-2 rounded-xl grid items-center flex-shrink-0 w-24 h-24 hover:scale-105 transition-all duration-300`}>
          <img
            src={img}
            alt={`img/cart-item/${title}`}
            className="w-20 h-auto object-fill -rotate-12 hover:rotate-0 transition-all duration-300"
          />
          <div className="absolute top-1 right-1 blur-effect-theme bg-white/80 text-black text-[0.65rem] font-bold px-1.5 rounded">
            ${price}
          </div>
        </div>
        <div className="grid items-center gap-1">
          <h1 className="text-base font-semibold text-slate-900 lg:text-sm">{title}</h1>
          <p className="text-xs text-slate-500 font-normal">{text}</p>
          <div className="flex items-center justify-between w-28 mt-2">
            <button
              type="button"
              onClick={onDecreaseItemQTY}
              className="bg-slate-900 text-white p-1 rounded-full active:scale-90 transition-all duration-200"
            >
              <MinusIcon className="w-3.5 h-3.5" />
            </button>
            <div className="bg-slate-900 text-white font-semibold text-xs rounded px-2.5 py-0.5">
              {cartQuantity}
            </div>
            <button
              type="button"
              onClick={onIncreaseItemQTY}
              className="bg-slate-900 text-white p-1 rounded-full active:scale-90 transition-all duration-200"
            >
              <PlusIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
      <div className="grid items-center gap-2 text-right">
        <div className="text-base font-bold text-slate-900 lg:text-sm">
          ${(price * cartQuantity).toFixed(2)}
        </div>
        <button
          type="button"
          onClick={onRemoveItem}
          className="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded cursor-pointer active:scale-90 transition-all duration-200 self-end"
        >
          <TrashIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default CartItem;