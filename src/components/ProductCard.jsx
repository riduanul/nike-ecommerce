import React from 'react';
import { StarIcon, ShoppingBagIcon, EyeIcon } from '@heroicons/react/24/solid';
import { useDispatch } from 'react-redux';
import { setAddItemToCart } from '../features/CartSlice.js';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { _id, id, title, text, img, price, rating, color, shadow } = product;

  const onAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(setAddItemToCart(product));
  };

  const productLink = `/product/${_id || id}`;

  return (
    <div
      className={`relative bg-gradient-to-b ${
        color || 'from-blue-600 to-blue-500'
      } ${
        shadow || 'shadow-lg shadow-blue-500'
      } rounded-2xl py-5 px-5 flex flex-col justify-between transition-all duration-500 hover:scale-[1.03] group shadow-xl`}
    >
      <Link to={productLink} className="block cursor-pointer">
        <div className="flex items-center justify-between">
          <span className="bg-white/80 backdrop-blur-md px-2.5 py-0.5 rounded-full text-slate-900 font-bold text-xs">
            ${price}
          </span>
          <div className="flex items-center gap-1 bg-black/20 backdrop-blur-md px-2 py-0.5 rounded-full text-slate-100 text-xs">
            <StarIcon className="w-3.5 h-3.5 text-amber-300" />
            <span>{rating || '5.0'}</span>
          </div>
        </div>

        <div className="my-6 flex items-center justify-center h-44">
          <img
            src={img}
            alt={title}
            className="h-36 w-auto object-contain -rotate-[20deg] group-hover:rotate-0 group-hover:scale-110 transition-all duration-500 filter drop-shadow-2xl"
          />
        </div>

        <div className="text-left mb-4">
          <h3 className="text-slate-100 text-lg font-bold line-clamp-1 filter drop-shadow">
            {title}
          </h3>
          <p className="text-slate-200 text-xs font-normal opacity-90">{text}</p>
        </div>
      </Link>

      <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/20">
        <Link
          to={productLink}
          className="flex-1 bg-white/20 hover:bg-white/30 text-white font-medium text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all"
        >
          <EyeIcon className="w-4 h-4" />
          <span>Details</span>
        </Link>

        <button
          type="button"
          onClick={onAddToCart}
          className="bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
        >
          <ShoppingBagIcon className="w-4 h-4 text-slate-900" />
          <span>Add</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
