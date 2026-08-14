import React, { useEffect, useState } from 'react';
import { MagnifyingGlassIcon, ShoppingBagIcon, UserIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import logo from '../assets/logo.png';
import { useDispatch, useSelector } from 'react-redux';
import { setOpenCart } from '../features/CartSlice.js';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [navState, setNavState] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const totalQTY = cartItems.reduce((acc, item) => acc + item.cartQuantity, 0);

  const onCartToggle = () => {
    dispatch(setOpenCart());
  };

  const onNavScroll = () => {
    if (window.scrollY > 30) {
      setNavState(true);
    } else {
      setNavState(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', onNavScroll);
    return () => {
      window.removeEventListener('scroll', onNavScroll);
    };
  }, []);

  return (
    <header
      className={
        !navState
          ? 'absolute top-7 left-0 right-0 opacity-100 z-50'
          : 'fixed top-0 left-0 right-0 h-[9vh] flex items-center justify-center opacity-100 z-[200] blur-effect-theme border-b border-slate-200/50'
      }
    >
      <nav className="flex items-center justify-between nike-container">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <img
              src={logo}
              alt="logo/img"
              className={`w-16 h-auto ${navState && 'filter brightness-0'}`}
            />
          </Link>

          <div className="hidden md:flex items-center gap-6 font-semibold text-sm">
            <Link
              to="/"
              className={`${
                navState ? 'text-slate-900 hover:text-blue-600' : 'text-slate-100 hover:text-amber-300'
              } transition-colors`}
            >
              Home
            </Link>
            <Link
              to="/shop"
              className={`${
                navState ? 'text-slate-900 hover:text-blue-600' : 'text-slate-100 hover:text-amber-300'
              } transition-colors`}
            >
              Shop All
            </Link>
          </div>
        </div>

        <ul className="flex items-center justify-center gap-4">
          <li>
            <Link
              to="/shop"
              className={`grid items-center p-1 rounded-full ${
                navState ? 'hover:bg-slate-100' : 'hover:bg-white/20'
              } transition-all`}
            >
              <MagnifyingGlassIcon
                className={`icon-style ${navState && 'text-slate-900'}`}
              />
            </Link>
          </li>

          {user?.role === 'admin' && (
            <li>
              <Link
                to="/admin"
                title="Admin Dashboard"
                className={`flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full ${
                  navState
                    ? 'bg-slate-900 text-white'
                    : 'bg-white/20 backdrop-blur text-white hover:bg-white/30'
                } transition-all`}
              >
                <ShieldCheckIcon className="w-4 h-4 text-emerald-400" />
                <span>Admin</span>
              </Link>
            </li>
          )}

          {user ? (
            <li>
              <Link
                to="/profile"
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${
                  navState
                    ? 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                    : 'bg-white/20 text-white hover:bg-white/30'
                } font-semibold text-xs transition-all`}
              >
                <UserIcon className="w-4 h-4" />
                <span>{user.name.split(' ')[0]}</span>
              </Link>
            </li>
          ) : (
            <li>
              <Link
                to="/login"
                className={`text-xs font-bold px-4 py-1.5 rounded-full ${
                  navState
                    ? 'bg-slate-900 text-white hover:bg-slate-800'
                    : 'bg-white text-slate-900 hover:bg-slate-100'
                } transition-all shadow-md`}
              >
                Sign In
              </Link>
            </li>
          )}

          <li className="grid items-center">
            <button
              onClick={onCartToggle}
              type="button"
              className="border-none outline-none active:scale-110 transition-all duration-300 relative"
            >
              <ShoppingBagIcon
                className={`icon-style ${navState && 'text-slate-900'}`}
              />
              <div
                className={`absolute -top-1.5 -right-1.5 shadow w-5 h-5 text-[0.65rem] leading-tight font-bold rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 ${
                  navState
                    ? 'bg-slate-900 text-slate-100 shadow-slate-900'
                    : 'bg-slate-100 text-slate-900 shadow-slate-100'
                }`}
              >
                {totalQTY}
              </div>
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;