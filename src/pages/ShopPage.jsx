import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../features/productSlice';
import ProductCard from '../components/ProductCard';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Cart from '../components/Cart';
import { footerAPI } from '../data/data';
import { MagnifyingGlassIcon, FunnelIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

const categories = [
  { id: '', name: 'All Categories' },
  { id: 'running', name: 'Running' },
  { id: 'basketball', name: 'Basketball' },
  { id: 'lifestyle', name: 'Lifestyle' },
  { id: 'training', name: 'Training' },
];

const ShopPage = () => {
  const dispatch = useDispatch();
  const { products, page, pages, total, loading } = useSelector((state) => state.products);

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [maxPrice, setMaxPrice] = useState(300);
  const [sort, setSort] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(
      fetchProducts({
        search,
        category: selectedCategory,
        maxPrice,
        sort,
        page: currentPage,
        limit: 12,
      })
    );
  }, [dispatch, search, selectedCategory, maxPrice, sort, currentPage]);

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setMaxPrice(300);
    setSort('newest');
    setCurrentPage(1);
  };

  return (
    <div className="bg-slate-900 min-h-screen text-slate-100 flex flex-col justify-between">
      <Navbar />
      <Cart />

      <div className="nike-container pt-32 pb-16 flex-1">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 md:p-12 mb-10 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl"></div>
          <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-3">
            Nike Product Collection
          </h1>
          <p className="text-slate-200 text-sm md:text-base max-w-xl mx-auto font-light">
            Discover the latest Nike innovations, premium footwear, and performance gear engineered for excellence.
          </p>
        </div>

        {/* Filters Bar */}
        <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700/60 rounded-2xl p-6 mb-8 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            {/* Search Input */}
            <div className="relative">
              <MagnifyingGlassIcon className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Search sneakers..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-11 pr-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>

            {/* Category Pills */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-all cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-all cursor-pointer"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>

            {/* Price Filter & Reset */}
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Max Price</span>
                  <span className="font-semibold text-blue-400">${maxPrice}</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="300"
                  step="10"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-blue-500 cursor-pointer"
                />
              </div>

              <button
                type="button"
                onClick={handleResetFilters}
                title="Reset Filters"
                className="p-2.5 bg-slate-700 hover:bg-slate-600 rounded-xl text-slate-300 hover:text-white transition-all active:scale-95"
              >
                <ArrowPathIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-slate-400 text-sm">
            Showing <span className="font-bold text-white">{products.length}</span> of{' '}
            <span className="font-bold text-white">{total || products.length}</span> products
          </p>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-slate-800/40 rounded-2xl border border-slate-700">
            <h3 className="text-xl font-bold text-slate-300 mb-2">No Products Found</h3>
            <p className="text-slate-500 text-sm mb-6">
              Try adjusting your search criteria or resetting filters.
            </p>
            <button
              onClick={handleResetFilters}
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition-all"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${
                  currentPage === p
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>

      <Footer footerApi={footerAPI} />
    </div>
  );
};

export default ShopPage;
