import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardStats, fetchAllOrders, updateOrderStatus } from '../features/orderSlice';
import { fetchProducts } from '../features/productSlice';
import { logout } from '../features/authSlice';
import API from '../services/api';
import logo from '../assets/logo.png';
import {
  CurrencyDollarIcon,
  ShoppingBagIcon,
  ClockIcon,
  CheckCircleIcon,
  PlusIcon,
  TrashIcon,
  ArrowTrendingUpIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  SparklesIcon,
  XMarkIcon,
  CubeIcon,
  UserGroupIcon,
  ChartBarIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
  Bars3Icon,
  BellIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const colorPresets = [
  { name: 'Electric Blue', value: 'from-blue-600 to-cyan-500', shadow: 'shadow-blue-500/50' },
  { name: 'Rose Cyber', value: 'from-rose-500 to-pink-600', shadow: 'shadow-rose-500/50' },
  { name: 'Emerald Volt', value: 'from-emerald-500 to-teal-500', shadow: 'shadow-emerald-500/50' },
  { name: 'Neon Violet', value: 'from-violet-600 to-purple-600', shadow: 'shadow-purple-500/50' },
  { name: 'Obsidian Gold', value: 'from-amber-500 to-orange-600', shadow: 'shadow-orange-500/50' },
];

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { stats, orders } = useSelector((state) => state.orders);
  const { products } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.auth);

  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [orderFilterStatus, setOrderFilterStatus] = useState('all');
  const [usersList, setUsersList] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Form state
  const [newProduct, setNewProduct] = useState({
    title: '',
    text: 'MEN Running Shoes',
    price: 199,
    category: 'running',
    img: '/assets/product1.png',
    color: colorPresets[0].value,
    shadow: colorPresets[0].shadow,
    stock: 50,
    description: '',
  });

  const loadData = () => {
    dispatch(fetchDashboardStats());
    dispatch(fetchAllOrders());
    dispatch(fetchProducts({ limit: 100 }));
    fetchUsers();
  };

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const { data } = await API.get('/auth/users');
      setUsersList(data);
    } catch (err) {
      console.log('Failed to fetch users:', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [dispatch]);

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      await API.post('/products', newProduct);
      toast.success('✨ Product Published Successfully!');
      setShowAddModal(false);
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to publish product');
    }
  };

  const handleDeleteProduct = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await API.delete(`/products/${id}`);
        toast.success(`Product "${title}" deleted`);
        loadData();
      } catch (err) {
        toast.error('Failed to delete product');
      }
    }
  };

  const handleStockUpdate = async (productId, currentStock, delta) => {
    const newStock = Math.max(0, currentStock + delta);
    try {
      await API.put(`/products/${productId}`, { stock: newStock });
      toast.success(`Stock updated to ${newStock}`);
      loadData();
    } catch (err) {
      toast.error('Failed to update stock');
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await dispatch(updateOrderStatus({ id: orderId, status: newStatus })).unwrap();
      toast.success(`Order status updated to ${newStatus.toUpperCase()}`);
      loadData();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out from Admin Dashboard');
    navigate('/login');
  };

  // Filtered Products
  const filteredProducts = products.filter(
    (p) =>
      p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    if (orderFilterStatus === 'all') return true;
    return o.status === orderFilterStatus;
  });

  // Chart Data
  const chartData = stats?.monthlyRevenue?.map((m) => ({
    month: m._id,
    revenue: m.revenue,
    orders: m.orders,
  })) || [
    { month: 'Mar', revenue: 3200 },
    { month: 'Apr', revenue: 4800 },
    { month: 'May', revenue: 6400 },
    { month: 'Jun', revenue: 5900 },
    { month: 'Jul', revenue: 8200 },
    { month: 'Aug', revenue: stats?.totalRevenue || 10450 },
  ];

  // Category Pie Chart
  const categoryCounts = products.reduce((acc, p) => {
    const cat = p.category || 'lifestyle';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});
  const pieData = Object.entries(categoryCounts).map(([name, value]) => ({ name, value }));
  const PIE_COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899'];

  const navMenuItems = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: ChartBarIcon },
    { id: 'products', label: `Products Catalog (${products.length})`, icon: CubeIcon },
    { id: 'orders', label: `Orders Fulfillment (${orders.length})`, icon: ShoppingBagIcon },
    { id: 'users', label: `Registered Users (${usersList.length})`, icon: UserGroupIcon },
  ];

  return (
    <div className="bg-[#080b14] min-h-screen text-slate-100 flex font-sans selection:bg-blue-500 selection:text-white relative overflow-x-hidden">
      {/* Dynamic Background Glows */}
      <div className="fixed top-0 left-64 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none"></div>

      {/* ==================== LEFT SIDEBAR MENU ==================== */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-72 bg-[#0d121f]/95 backdrop-blur-2xl border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Logo Brand Header */}
          <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center p-1.5 shadow-lg shadow-blue-500/30">
                <img src={logo} alt="Nike Logo" className="w-full h-auto filter brightness-0 invert" />
              </div>
              <div>
                <h2 className="font-black text-white uppercase text-base tracking-tight leading-none">Nike Admin</h2>
                <span className="text-[0.65rem] text-blue-400 font-bold tracking-widest uppercase">Executive Suite</span>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-slate-400 hover:text-white p-1"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation Menu */}
          <nav className="p-4 space-y-1.5">
            <span className="text-[0.65rem] font-bold text-slate-500 uppercase tracking-widest px-3 mb-2 block">
              Main Menu
            </span>
            {navMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeMenu === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveMenu(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-xs font-bold transition-all relative ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="absolute right-3 w-2 h-2 rounded-full bg-white animate-pulse"></span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer — Admin User Profile */}
        <div className="p-4 border-t border-slate-800/80">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-black text-sm text-white flex-shrink-0">
                {user?.name ? user.name[0].toUpperCase() : 'A'}
              </div>
              <div className="overflow-hidden">
                <h4 className="font-bold text-white text-xs truncate">{user?.name || 'Administrator'}</h4>
                <p className="text-[0.65rem] text-slate-400 truncate">{user?.email || 'admin@nike.com'}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Backdrop for Mobile Sidebar */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        ></div>
      )}

      {/* ==================== RIGHT MAIN CONTENT AREA ==================== */}
      <div className="flex-1 lg:pl-72 flex flex-col min-h-screen">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-[#080b14]/80 backdrop-blur-xl border-b border-slate-800/80 px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-slate-300 hover:text-white p-2 bg-slate-800 rounded-xl"
            >
              <Bars3Icon className="w-5 h-5" />
            </button>
            <div>
              <div className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                <span>Admin</span>
                <span>/</span>
                <span className="text-blue-400 font-bold capitalize">{activeMenu}</span>
              </div>
              <h1 className="text-lg font-black text-white uppercase tracking-tight">
                {activeMenu === 'dashboard' && 'Executive Dashboard'}
                {activeMenu === 'products' && 'Products & Inventory Catalog'}
                {activeMenu === 'orders' && 'Customer Orders Command Desk'}
                {activeMenu === 'users' && 'Registered Users Directory'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold px-3 py-1.5 rounded-xl">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              Live Server 5001
            </span>

            <button
              type="button"
              onClick={loadData}
              title="Refresh Data"
              className="p-2.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white rounded-xl transition-all active:scale-95"
            >
              <ArrowPathIcon className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
            >
              <PlusIcon className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden sm:inline">Add Product</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/')}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs px-3.5 py-2.5 rounded-xl transition-all"
            >
              Back to Store
            </button>
          </div>
        </header>

        {/* Dynamic Body Content */}
        <main className="p-6 md:p-8 flex-1 space-y-8">
          {/* ================= TAB 1: DASHBOARD OVERVIEW ================= */}
          {activeMenu === 'dashboard' && (
            <div className="space-y-8">
              {/* 4 Compact Grid Stat Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {/* Gross Revenue */}
                <div className="bg-slate-900/70 backdrop-blur-xl border border-slate-800/80 p-5 rounded-2xl shadow-xl relative overflow-hidden group hover:border-blue-500/50 hover:shadow-blue-500/10 transition-all">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-400"></div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[0.7rem] font-bold text-slate-400 uppercase tracking-wider">Gross Revenue</span>
                    <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0">
                      <CurrencyDollarIcon className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-white tracking-tight mb-1">
                    ${stats?.totalRevenue ? stats.totalRevenue.toFixed(2) : '10,450.00'}
                  </div>
                  <div className="flex items-center gap-1 text-[0.65rem] font-bold text-emerald-400">
                    <ArrowTrendingUpIcon className="w-3.5 h-3.5" />
                    <span>+22.5% vs last month</span>
                  </div>
                </div>

                {/* Total Orders */}
                <div className="bg-slate-900/70 backdrop-blur-xl border border-slate-800/80 p-5 rounded-2xl shadow-xl relative overflow-hidden group hover:border-purple-500/50 hover:shadow-purple-500/10 transition-all">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[0.7rem] font-bold text-slate-400 uppercase tracking-wider">Total Orders</span>
                    <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 flex-shrink-0">
                      <ShoppingBagIcon className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-white tracking-tight mb-1">
                    {stats?.totalOrders || orders.length || 42}
                  </div>
                  <div className="flex items-center gap-1 text-[0.65rem] font-bold text-purple-300">
                    <CheckCircleIcon className="w-3.5 h-3.5" />
                    <span>98.2% completion</span>
                  </div>
                </div>

                {/* Pending Orders */}
                <div className="bg-slate-900/70 backdrop-blur-xl border border-slate-800/80 p-5 rounded-2xl shadow-xl relative overflow-hidden group hover:border-amber-500/50 hover:shadow-amber-500/10 transition-all">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500"></div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[0.7rem] font-bold text-slate-400 uppercase tracking-wider">Pending Orders</span>
                    <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0">
                      <ClockIcon className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-white tracking-tight mb-1">
                    {stats?.pendingOrders || orders.filter((o) => o.status === 'pending').length || 4}
                  </div>
                  <div className="flex items-center gap-1 text-[0.65rem] font-bold text-amber-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
                    <span>Action Required</span>
                  </div>
                </div>

                {/* Product Models */}
                <div className="bg-slate-900/70 backdrop-blur-xl border border-slate-800/80 p-5 rounded-2xl shadow-xl relative overflow-hidden group hover:border-emerald-500/50 hover:shadow-emerald-500/10 transition-all">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-400"></div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[0.7rem] font-bold text-slate-400 uppercase tracking-wider">Catalog Inventory</span>
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
                      <CubeIcon className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-white tracking-tight mb-1">
                    {products.length} Products
                  </div>
                  <div className="flex items-center gap-1 text-[0.65rem] font-bold text-emerald-400">
                    <CheckCircleIcon className="w-3.5 h-3.5" />
                    <span>MongoDB Synced</span>
                  </div>
                </div>
              </div>

              {/* Side-by-Side Analytics Charts (50% - 50%) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Growth Trend Chart */}
                <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-6 md:p-8 rounded-3xl shadow-xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-lg font-black text-white uppercase tracking-wider">Revenue Growth Trend</h3>
                        <p className="text-xs text-slate-400">Monthly earnings overview ($ USD)</p>
                      </div>
                      <span className="bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold px-3 py-1 rounded-full">
                        Interactive Graph
                      </span>
                    </div>

                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                          <defs>
                            <linearGradient id="areaRevMain" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                          <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                          <YAxis stroke="#64748b" fontSize={12} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#0d121f',
                              borderColor: '#334155',
                              borderRadius: '16px',
                            }}
                            itemStyle={{ color: '#60a5fa', fontWeight: 'bold' }}
                          />
                          <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fill="url(#areaRevMain)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Category Spread Donut Chart */}
                <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-6 md:p-8 rounded-3xl shadow-xl flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-black text-white uppercase tracking-wider mb-1">Catalog Categories</h3>
                    <p className="text-xs text-slate-400 mb-4">Item distribution by category</p>

                    <div className="h-44 w-full flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={pieData} innerRadius={50} outerRadius={70} paddingAngle={4} dataKey="value">
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={{ backgroundColor: '#0d121f', borderColor: '#334155', borderRadius: '12px' }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="space-y-2 mt-2">
                      {pieData.map((item, i) => (
                        <div key={item.name} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}></span>
                            <span className="uppercase text-slate-300 font-bold">{item.name}</span>
                          </div>
                          <span className="text-slate-400 font-bold">{item.value} items</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 2: PRODUCTS CATALOG ================= */}
          {activeMenu === 'products' && (
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-6 md:p-8 rounded-3xl shadow-xl">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
                <div className="relative w-full md:w-96">
                  <MagnifyingGlassIcon className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
                  <input
                    type="text"
                    placeholder="Search by shoe title, tag, or category..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto justify-between">
                  <span className="text-xs text-slate-400 font-semibold">
                    Showing <span className="text-white font-bold">{filteredProducts.length}</span> of {products.length} Products
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(true)}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shadow-lg shadow-blue-500/20"
                  >
                    <PlusIcon className="w-4 h-4" />
                    <span>Publish Shoe</span>
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-slate-950 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-800">
                    <tr>
                      <th className="py-4 px-4">Shoe Model</th>
                      <th className="py-4 px-4">Category</th>
                      <th className="py-4 px-4">Price</th>
                      <th className="py-4 px-4">Stock Controls</th>
                      <th className="py-4 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {filteredProducts.map((p) => (
                      <tr key={p._id || p.id} className="hover:bg-slate-800/40 transition-colors group">
                        <td className="py-4 px-4 flex items-center gap-4">
                          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-b ${p.color || 'from-blue-600 to-indigo-600'} p-2 flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-105 transition-transform`}>
                            <img src={p.img} alt={p.title} className="w-12 h-auto object-contain -rotate-12" />
                          </div>
                          <div>
                            <div className="font-extrabold text-white text-base">{p.title}</div>
                            <div className="text-xs text-slate-400 font-light">{p.text}</div>
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <span className="bg-slate-950 border border-slate-800 text-blue-400 text-xs font-extrabold uppercase px-3 py-1 rounded-full">
                            {p.category || 'Footwear'}
                          </span>
                        </td>

                        <td className="py-4 px-4 font-black text-white text-base">${p.price}</td>

                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => handleStockUpdate(p._id || p.id, p.stock || 50, -5)}
                              className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold flex items-center justify-center text-xs"
                            >
                              -
                            </button>
                            <span className="font-mono font-bold text-xs text-white min-w-[50px] text-center">
                              {p.stock || 50} pcs
                            </span>
                            <button
                              type="button"
                              onClick={() => handleStockUpdate(p._id || p.id, p.stock || 50, +5)}
                              className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold flex items-center justify-center text-xs"
                            >
                              +
                            </button>
                          </div>
                        </td>

                        <td className="py-4 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleDeleteProduct(p._id || p.id, p.title)}
                            className="p-2.5 bg-red-500/10 hover:bg-red-500/30 text-red-400 border border-red-500/20 rounded-xl transition-all active:scale-95"
                            title="Delete Product"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================= TAB 3: ORDERS FULFILLMENT ================= */}
          {activeMenu === 'orders' && (
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-6 md:p-8 rounded-3xl shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
                <div className="flex flex-wrap gap-2">
                  {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setOrderFilterStatus(st)}
                      className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                        orderFilterStatus === st
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                          : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                <span className="text-xs text-slate-400 font-semibold">
                  Found <span className="font-bold text-white">{filteredOrders.length}</span> orders
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-slate-950 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-800">
                    <tr>
                      <th className="py-4 px-4">Order ID & Date</th>
                      <th className="py-4 px-4">Customer</th>
                      <th className="py-4 px-4">Total Amount</th>
                      <th className="py-4 px-4">Payment</th>
                      <th className="py-4 px-4">Status</th>
                      <th className="py-4 px-4 text-right">Update Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {filteredOrders.map((o) => (
                      <tr key={o._id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-4 px-4">
                          <div className="font-mono font-bold text-white text-xs">{o._id}</div>
                          <div className="text-xs text-slate-500">
                            {new Date(o.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <div className="font-extrabold text-white">
                            {o.shippingAddress?.fullName || o.user?.name || 'Customer'}
                          </div>
                          <div className="text-xs text-slate-400">
                            {o.shippingAddress?.city || 'Dhaka'}, {o.shippingAddress?.country || 'Bangladesh'}
                          </div>
                        </td>

                        <td className="py-4 px-4 font-black text-blue-400 text-base">
                          ${o.totalPrice?.toFixed(2)}
                        </td>

                        <td className="py-4 px-4 uppercase text-xs font-bold text-slate-300">
                          {o.paymentMethod?.toUpperCase() || 'COD'}
                        </td>

                        <td className="py-4 px-4">
                          <span
                            className={`text-xs font-black uppercase px-3 py-1 rounded-full border ${
                              o.status === 'delivered'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                : o.status === 'shipped'
                                ? 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                                : o.status === 'processing'
                                ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                                : o.status === 'cancelled'
                                ? 'bg-red-500/10 text-red-400 border-red-500/30'
                                : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            }`}
                          >
                            {o.status}
                          </span>
                        </td>

                        <td className="py-4 px-4 text-right">
                          <select
                            value={o.status}
                            onChange={(e) => handleStatusChange(o._id, e.target.value)}
                            className="bg-slate-950 border border-slate-700 text-xs font-bold text-white rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500 cursor-pointer"
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================= TAB 4: USERS DIRECTORY ================= */}
          {activeMenu === 'users' && (
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-6 md:p-8 rounded-3xl shadow-xl">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
                <h3 className="text-lg font-black text-white uppercase tracking-wider">User Directory</h3>
                <span className="text-xs text-slate-400">Total Users: <strong className="text-white">{usersList.length}</strong></span>
              </div>

              {loadingUsers ? (
                <div className="py-12 text-center text-slate-400">Loading users...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-300">
                    <thead className="bg-slate-950 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-800">
                      <tr>
                        <th className="py-4 px-4">User</th>
                        <th className="py-4 px-4">Email</th>
                        <th className="py-4 px-4">Role</th>
                        <th className="py-4 px-4">Joined Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80">
                      {usersList.map((u) => (
                        <tr key={u._id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-4 px-4 flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-blue-600 font-bold text-xs flex items-center justify-center text-white">
                              {u.name ? u.name[0].toUpperCase() : 'U'}
                            </div>
                            <span className="font-bold text-white">{u.name}</span>
                          </td>
                          <td className="py-4 px-4 text-xs font-mono">{u.email}</td>
                          <td className="py-4 px-4">
                            <span className={`text-xs font-bold uppercase px-3 py-1 rounded-full ${u.role === 'admin' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-slate-800 text-slate-300'}`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-xs text-slate-400">
                            {new Date(u.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Glassmorphism Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-lg z-[300] flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <SparklesIcon className="w-5 h-5 text-amber-400" />
                  <span>Publish New Nike Model</span>
                </h3>
                <p className="text-xs text-slate-400">Add a new shoe model into MongoDB Atlas catalog</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-full"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Product Title *
                </label>
                <input
                  type="text"
                  required
                  value={newProduct.title}
                  onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                  placeholder="Nike ZoomX Vaporfly NEXT% 2"
                  className="w-full bg-[#080d1a] border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 font-semibold focus:outline-none focus:border-blue-500 focus:bg-[#0f172a]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Price ($ USD) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                    className="w-full bg-[#080d1a] border border-slate-700 rounded-xl px-4 py-3 text-sm text-white font-semibold focus:outline-none focus:border-blue-500 focus:bg-[#0f172a]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Category *
                  </label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full bg-[#080d1a] border border-slate-700 rounded-xl px-4 py-3 text-sm text-white font-semibold focus:outline-none focus:border-blue-500 cursor-pointer focus:bg-[#0f172a]"
                  >
                    <option value="running" className="bg-slate-900 text-white font-medium">Running</option>
                    <option value="basketball" className="bg-slate-900 text-white font-medium">Basketball</option>
                    <option value="lifestyle" className="bg-slate-900 text-white font-medium">Lifestyle</option>
                    <option value="training" className="bg-slate-900 text-white font-medium">Training</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Theme Preset Gradient
                </label>
                <div className="grid grid-cols-5 gap-2 pt-1">
                  {colorPresets.map((preset, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setNewProduct({ ...newProduct, color: preset.value, shadow: preset.shadow })}
                      className={`h-10 rounded-xl bg-gradient-to-br ${preset.value} border-2 transition-all ${
                        newProduct.color === preset.value
                          ? 'border-white scale-105 shadow-lg'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                      title={preset.name}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Image Path / URL *
                </label>
                <input
                  type="text"
                  required
                  value={newProduct.img}
                  onChange={(e) => setNewProduct({ ...newProduct, img: e.target.value })}
                  placeholder="/assets/product1.png"
                  className="w-full bg-[#080d1a] border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 font-semibold focus:outline-none focus:border-blue-500 focus:bg-[#0f172a]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  rows="3"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  placeholder="Engineered with ZoomX foam..."
                  className="w-full bg-[#080d1a] border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 font-semibold focus:outline-none focus:border-blue-500 focus:bg-[#0f172a]"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs py-3.5 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-extrabold text-xs py-3.5 rounded-xl shadow-lg transition-all uppercase tracking-wider"
                >
                  Publish Shoe
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
