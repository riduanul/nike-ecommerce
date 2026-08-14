import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import React from 'react';
import emptybag from '../../assets/emptybag.png';

const CartEmpty = ({ onCartToggle }) => {
  return (
    <div className="flex items-center justify-center flex-col h-[80vh] px-11 text-center gap-7">
      <img
        src={emptybag}
        alt="empty-bag"
        className="w-40 lg:w-36 sm:w-28 h-auto object-fill transition-all duration-300 hover:scale-110"
      />
      <h2 className="text-xl font-bold text-slate-800">Your Cart is Empty</h2>
      <button
        type="button"
        onClick={onCartToggle}
        className="button-theme bg-gradient-to-b from-amber-500 to-orange-500 shadow-lg shadow-orange-500 flex items-center justify-center text-slate-900 py-2.5 px-6 gap-3 text-sm font-semibold hover:scale-105 active:scale-95 transition-all"
      >
        <ArrowLeftIcon className="w-5 h-5 text-slate-900" />
        <span>Back To Nike Store</span>
      </button>
    </div>
  );
};

export default CartEmpty;