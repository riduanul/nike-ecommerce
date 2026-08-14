import React from 'react';
import { ChevronDoubleLeftIcon, XMarkIcon } from '@heroicons/react/24/solid';

const CartCount = ({ onCartToggle, totalQTY, onClearCartItems }) => {
  return (
    <div className="bg-white h-12 flex items-center justify-between px-4 sticky top-0 left-0 right-0 w-full z-50 border-b border-slate-200 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="grid items-center cursor-pointer" onClick={onCartToggle}>
          <ChevronDoubleLeftIcon className="w-5 h-5 text-slate-900 hover:text-orange-500 transition-colors" />
        </div>
        <div className="grid items-center">
          <h1 className="text-base font-semibold text-slate-900">
            Your Cart{' '}
            <span className="bg-slate-900 font-medium text-slate-100 rounded px-2 py-0.5 text-xs">
              ({totalQTY} {totalQTY === 1 ? 'Item' : 'Items'})
            </span>
          </h1>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {totalQTY > 0 && (
          <button
            type="button"
            onClick={onClearCartItems}
            className="text-xs bg-red-500 hover:bg-red-600 text-white font-medium px-2 py-1 rounded transition-all active:scale-95"
          >
            Clear Cart
          </button>
        )}
        <button
          type="button"
          onClick={onCartToggle}
          className="rounded bg-slate-900 text-white p-1 hover:bg-slate-800 active:scale-90 transition-all"
        >
          <XMarkIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default CartCount;