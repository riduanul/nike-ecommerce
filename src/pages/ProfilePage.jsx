import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyOrders } from '../features/orderSlice';
import { logout, updateUserProfile } from '../features/authSlice';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Cart from '../components/Cart';
import { footerAPI } from '../data/data';
import { UserIcon, ShoppingBagIcon, ArrowRightOnRectangleIcon, CheckCircleIcon, ClockIcon } from '@heroicons/react/24/solid';
import { toast } from 'react-hot-toast';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { myOrders, loading } = useSelector((state) => state.orders);

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [street, setStreet] = useState(user?.address?.street || '');
  const [city, setCity] = useState(user?.address?.city || '');

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    dispatch(
      updateUserProfile({
        name,
        phone,
        address: { street, city },
      })
    );
    setIsEditing(false);
    toast.success('Profile updated successfully!');
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'delivered':
        return <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase">Delivered</span>;
      case 'shipped':
        return <span className="bg-purple-500/10 text-purple-400 border border-purple-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase">Shipped</span>;
      case 'processing':
        return <span className="bg-blue-500/10 text-blue-400 border border-blue-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase">Processing</span>;
      default:
        return <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase">Pending</span>;
    }
  };

  return (
    <div className="bg-slate-900 min-h-screen text-slate-100 flex flex-col justify-between">
      <Navbar />
      <Cart />

      <div className="nike-container pt-32 pb-20 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* User Profile Info Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/80 rounded-3xl p-6 shadow-xl text-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 mx-auto flex items-center justify-center font-black text-3xl text-white shadow-lg mb-4">
                {user?.name ? user.name[0].toUpperCase() : 'U'}
              </div>
              <h2 className="text-xl font-bold text-white">{user?.name}</h2>
              <p className="text-xs text-slate-400 mb-3">{user?.email}</p>
              <span className="bg-blue-500/20 text-blue-300 text-xs font-bold px-3 py-1 rounded-full uppercase border border-blue-500/30">
                {user?.role || 'Customer'}
              </span>

              <div className="mt-6 pt-6 border-t border-slate-700 space-y-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(!isEditing)}
                  className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold text-xs py-2.5 rounded-xl transition-all"
                >
                  {isEditing ? 'Cancel Edit' : 'Edit Profile Info'}
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-semibold text-xs py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all"
                >
                  <ArrowRightOnRectangleIcon className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>

            {/* Profile Edit Form */}
            {isEditing && (
              <form onSubmit={handleUpdateProfile} className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/80 rounded-3xl p-6 shadow-xl space-y-4">
                <h3 className="text-sm font-bold text-white mb-2">Update Account Details</h3>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Phone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Street</label>
                  <input
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-2.5 rounded-xl transition-all"
                >
                  Save Changes
                </button>
              </form>
            )}
          </div>

          {/* Order History */}
          <div className="lg:col-span-8">
            <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/80 rounded-3xl p-6 md:p-8 shadow-xl">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-700">
                <ShoppingBagIcon className="w-6 h-6 text-blue-400" />
                <h2 className="text-xl font-bold text-white">Order History ({myOrders.length})</h2>
              </div>

              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : myOrders.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-sm">
                  No orders placed yet. Explore the shop and place your first Nike order!
                </div>
              ) : (
                <div className="space-y-4">
                  {myOrders.map((order) => (
                    <div key={order._id} className="bg-slate-900/60 rounded-2xl p-5 border border-slate-700/60 space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800 text-xs">
                        <div>
                          <span className="text-slate-400">Order ID: </span>
                          <span className="font-mono text-white font-bold">{order._id}</span>
                        </div>
                        <div className="text-slate-400">
                          {new Date(order.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </div>
                        <div>{getStatusBadge(order.status)}</div>
                      </div>

                      {/* Items */}
                      <div className="space-y-2">
                        {order.orderItems?.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs text-slate-300">
                            <div className="flex items-center gap-3">
                              <img src={item.img} alt={item.title} className="w-10 h-10 object-contain bg-slate-800 rounded p-1" />
                              <div>
                                <h4 className="font-bold text-white">{item.title}</h4>
                                <span className="text-slate-400">Qty: {item.qty} × ${item.price}</span>
                              </div>
                            </div>
                            <span className="font-bold text-white">${(item.qty * item.price).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>

                      {/* Summary footer */}
                      <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs font-bold text-white">
                        <span>Total Paid: ${order.totalPrice?.toFixed(2)}</span>
                        <span className="text-slate-400 font-normal">Method: {order.paymentMethod?.toUpperCase()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer footerApi={footerAPI} />
    </div>
  );
};

export default ProfilePage;
