import React from 'react';
import { StarIcon, ShoppingBagIcon } from '@heroicons/react/24/solid';
import { useDispatch } from 'react-redux';
import { setAddItemToCart, setOpenCart } from '../../features/CartSlice.js';

const Item = ({ id, _id, color, shadow, title, text, img, btn, rating, price, ifExists }) => {
  const dispatch = useDispatch();

  const onAddToCart = () => {
    const item = { id: id || _id, _id: _id || id, title, text, img, color, shadow, price };
    dispatch(setAddItemToCart(item));
  };

  const onBuyNow = () => {
    onAddToCart();
    dispatch(setOpenCart());
  };

  return (
    <div
      className={`relative bg-gradient-to-b ${color} ${shadow} grid items-center ${
        ifExists ? 'justify-items-start' : 'justify-items-center'
      } rounded-xl py-4 px-5 transition-all duration-700 ease-out w-full hover:scale-105 shadow-xl`}
    >
      <div className={`grid items-center ${ifExists ? 'justify-items-start' : 'justify-items-center'}`}>
        <h1 className="text-slate-200 text-xl lg:text-lg md:text-base filter drop-shadow font-bold">{title}</h1>
        <p className="text-slate-200 filter drop-shadow text-base md:text-sm font-normal">{text}</p>
        <div className="flex items-center justify-between w-28 my-2">
          <div className="flex items-center bg-white/80 px-1 rounded blur-effect-theme">
            <h1 className="text-black text-sm font-bold">${price}</h1>
          </div>
          <div className="flex items-center gap-1">
            <StarIcon className="icon-style w-5 h-5 md:w-4 md:h-4 text-amber-300" />
            <h1 className="md:text-sm font-normal text-slate-100">{rating}</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="bg-white blur-effect-theme button-theme p-1 shadow shadow-slate-200 hover:scale-110 active:scale-95 transition-all"
            onClick={onAddToCart}
            title="Add to Cart"
          >
            <ShoppingBagIcon className="icon-style text-slate-900" />
          </button>
          <button
            type="button"
            className="bg-white blur-effect-theme button-theme px-3 py-1 shadow shadow-slate-200 text-sm text-black font-semibold hover:bg-slate-100 active:scale-95 transition-all"
            onClick={onBuyNow}
          >
            {btn || 'Buy Now'}
          </button>
        </div>
      </div>
      <div className={`flex items-center ${ifExists ? 'absolute top-5 right-1' : 'justify-center'}`}>
        <img
          src={img}
          alt={`img/item-img/${id || _id}`}
          className={`transitions-theme hover:-rotate-12 ${
            ifExists ? 'h-auto w-64 lg:w-56 md:w-48 -rotate-[35deg]' : 'h-36 w-64'
          }`}
        />
      </div>
    </div>
  );
};

export default Item;