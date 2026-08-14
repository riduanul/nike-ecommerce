import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../features/orderSlice';
import { setClearCartItems } from '../features/CartSlice.js';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Cart from '../components/Cart';
import { footerAPI } from '../data/data';
import { toast } from 'react-hot-toast';
import { ShieldCheckIcon, TruckIcon, CreditCardIcon, BanknotesIcon } from '@heroicons/react/24/solid';

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cartItems, cartTotalAmount } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.orders);

  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || '',
    country: user?.address?.country || 'Bangladesh',
    phone: user?.phone || '',
  });

  const [paymentMethod, setPaymentMethod] = useState('cod');

  const taxPrice = Math.round(cartTotalAmount * 0.05 * 100) / 100;
  const shippingPrice = cartTotalAmount > 500 ? 0 : 25;
  const totalPrice = Math.round((cartTotalAmount + taxPrice + shippingPrice) * 100) / 100;

  const handleChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    if (!shippingAddress.fullName || !shippingAddress.street || !shippingAddress.city) {
      toast.error('Please fill all required shipping address fields');
      return;
    }

    const orderData = {
      orderItems: cartItems.map((item) => ({
        product: item._id || item.id,
        title: item.title,
        img: item.img,
        price: Number(item.price),
        qty: item.cartQuantity,
        size: item.selectedSize || 10,
      })),
      shippingAddress,
      paymentMethod,
    };

    try {
      const result = await dispatch(createOrder(orderData)).unwrap();
      dispatch(setClearCartItems());
      toast.success('Order placed successfully! 🎉');
      navigate('/profile');
    } catch (err) {
      toast.error(err || 'Failed to place order');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="bg-slate-900 min-h-screen text-slate-100 flex flex-col justify-between">
        <Navbar />
        <div className="text-center py-36">
          <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
          <p className="text-slate-400 mb-6">Add some products to your cart before proceeding to checkout.</p>
          <button
            onClick={() => navigate('/shop')}
            className="bg-blue-600 px-6 py-3 rounded-xl font-bold text-sm hover:bg-blue-500 transition-all"
          >
            Explore Shop
          </button>
        </div>
        <Footer footerApi={footerAPI} />
      </div>
    );
  }

  return (
    <div className="bg-slate-900 min-h-screen text-slate-100 flex flex-col justify-between">
      <Navbar />
      <Cart />

      <div className="nike-container pt-32 pb-20 flex-1">
        <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight mb-8">
          Checkout & Shipping
        </h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Shipping & Payment Form */}
          <div className="lg:col-span-7 space-y-6">
            {/* Shipping Info Card */}
            <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/80 rounded-3xl p-6 md:p-8 shadow-xl">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-700">
                <TruckIcon className="w-6 h-6 text-blue-400" />
                <h2 className="text-xl font-bold text-white">1. Shipping Address</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={shippingAddress.fullName}
                    onChange={handleChange}
                    required
                    placeholder="Md. Riduanul Haque"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Street Address *</label>
                  <input
                    type="text"
                    name="street"
                    value={shippingAddress.street}
                    onChange={handleChange}
                    required
                    placeholder="House 12, Road 5, Block B"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={shippingAddress.city}
                    onChange={handleChange}
                    required
                    placeholder="Dhaka"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">State / Region</label>
                  <input
                    type="text"
                    name="state"
                    value={shippingAddress.state}
                    onChange={handleChange}
                    placeholder="Dhaka Division"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Postal Code</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={shippingAddress.zipCode}
                    onChange={handleChange}
                    placeholder="1212"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    value={shippingAddress.phone}
                    onChange={handleChange}
                    placeholder="+8801700000000"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Payment Options Card */}
            <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/80 rounded-3xl p-6 md:p-8 shadow-xl">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-700">
                <CreditCardIcon className="w-6 h-6 text-purple-400" />
                <h2 className="text-xl font-bold text-white">2. Payment Method</h2>
              </div>

              <div className="space-y-3">
                <label
                  onClick={() => setPaymentMethod('cod')}
                  className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'bg-blue-600/10 border-blue-500 text-white'
                      : 'bg-slate-900/50 border-slate-700 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="accent-blue-500"
                    />
                    <div className="flex items-center gap-2">
                      <BanknotesIcon className="w-5 h-5 text-emerald-400" />
                      <div>
                        <div className="font-bold text-sm text-white">Cash On Delivery (COD)</div>
                        <div className="text-xs text-slate-400">Pay when your Nike order arrives at your door</div>
                      </div>
                    </div>
                  </div>
                </label>

                <label
                  onClick={() => setPaymentMethod('stripe')}
                  className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'stripe'
                      ? 'bg-blue-600/10 border-blue-500 text-white'
                      : 'bg-slate-900/50 border-slate-700 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'stripe'}
                      onChange={() => setPaymentMethod('stripe')}
                      className="accent-blue-500"
                    />
                    <div className="flex items-center gap-2">
                      <CreditCardIcon className="w-5 h-5 text-purple-400" />
                      <div>
                        <div className="font-bold text-sm text-white">Credit Card (Stripe)</div>
                        <div className="text-xs text-slate-400">Pay securely with Visa, Mastercard, AMEX</div>
                      </div>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Order Summary Column */}
          <div className="lg:col-span-5">
            <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/80 rounded-3xl p-6 md:p-8 shadow-xl sticky top-32">
              <h2 className="text-xl font-bold text-white mb-6 pb-4 border-b border-slate-700">
                Order Summary ({cartItems.length} items)
              </h2>

              {/* Items List */}
              <div className="max-h-60 overflow-y-auto scroll-style space-y-3 mb-6 pr-2">
                {cartItems.map((item, i) => (
                  <div key={i} className="flex items-center justify-between gap-3 text-sm">
                    <div className="flex items-center gap-3">
                      <img src={item.img} alt={item.title} className="w-12 h-12 object-contain bg-slate-900 rounded-lg p-1" />
                      <div>
                        <h4 className="font-semibold text-white text-xs line-clamp-1">{item.title}</h4>
                        <span className="text-xs text-slate-400">
                          Qty: {item.cartQuantity} × ${item.price}
                        </span>
                      </div>
                    </div>
                    <span className="font-bold text-white text-xs">${(item.price * item.cartQuantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-2 pt-4 border-t border-slate-700/80 text-sm">
                <div className="flex justify-between text-slate-300">
                  <span>Subtotal</span>
                  <span>${cartTotalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Estimated Tax (5%)</span>
                  <span>${taxPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Shipping</span>
                  <span>{shippingPrice === 0 ? 'FREE' : `$${shippingPrice.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-lg font-black text-white pt-3 border-t border-slate-700">
                  <span>Total Amount</span>
                  <span className="text-blue-400">${totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 rounded-2xl shadow-xl hover:shadow-blue-500/30 active:scale-95 transition-all text-sm uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <ShieldCheckIcon className="w-5 h-5 text-white" />
                <span>{loading ? 'Processing Order...' : 'Place Order Now'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      <Footer footerApi={footerAPI} />
    </div>
  );
};

export default CheckoutPage;
