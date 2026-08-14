import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById } from '../features/productSlice';
import { setAddItemToCart } from '../features/CartSlice.js';
import API from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Cart from '../components/Cart';
import { footerAPI } from '../data/data';
import { StarIcon, ShoppingBagIcon, ShieldCheckIcon, TruckIcon, ArrowPathIcon } from '@heroicons/react/24/solid';
import { toast } from 'react-hot-toast';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { product, loading, error } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.auth);

  const [selectedSize, setSelectedSize] = useState(10);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    dispatch(fetchProductById(id));
    fetchReviews();
  }, [dispatch, id]);

  const fetchReviews = async () => {
    try {
      const { data } = await API.get(`/reviews/product/${id}`);
      setReviews(data);
    } catch (err) {
      console.log('No backend reviews or error:', err);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      dispatch(
        setAddItemToCart({
          ...product,
          selectedSize,
        })
      );
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to post a review');
      navigate('/login');
      return;
    }
    if (!comment.trim()) {
      toast.error('Please write a review comment');
      return;
    }

    try {
      setSubmittingReview(true);
      await API.post('/reviews', {
        productId: id,
        rating,
        comment,
      });
      toast.success('Review posted successfully!');
      setComment('');
      fetchReviews();
      dispatch(fetchProductById(id));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-slate-900 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="bg-slate-900 min-h-screen text-slate-100 flex flex-col justify-between">
        <Navbar />
        <div className="text-center py-32">
          <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
          <button
            onClick={() => navigate('/shop')}
            className="bg-blue-600 px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-500 transition-all"
          >
            Back to Shop
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
        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-slate-800/60 backdrop-blur-xl border border-slate-700/80 rounded-3xl p-8 md:p-12 shadow-2xl mb-16">
          {/* Image Showcase */}
          <div className="relative bg-gradient-to-b from-blue-600 to-indigo-700 rounded-2xl p-8 flex items-center justify-center min-h-[380px] group shadow-2xl overflow-hidden">
            <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wider">
              {product.category || 'Footwear'}
            </div>
            <img
              src={product.img}
              alt={product.title}
              className="w-full max-w-md h-auto object-contain -rotate-[15deg] group-hover:rotate-0 group-hover:scale-105 transition-all duration-700 filter drop-shadow-2xl"
            />
          </div>

          {/* Details Column */}
          <div className="flex flex-col gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-1 bg-amber-400/10 border border-amber-400/30 px-2.5 py-1 rounded-full text-amber-300 text-xs font-bold">
                  <StarIcon className="w-4 h-4 text-amber-400" />
                  <span>{product.avgRating || product.rating || '4.9'}</span>
                  <span className="text-slate-400 ml-1">({reviews.length} reviews)</span>
                </div>
                <span className="text-emerald-400 text-xs font-bold bg-emerald-400/10 px-2.5 py-1 rounded-full border border-emerald-400/30">
                  In Stock ({product.stock || 50})
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-black text-white mb-2">{product.title}</h1>
              <p className="text-slate-400 font-medium text-sm">{product.text}</p>
            </div>

            <div className="text-3xl font-extrabold text-white">
              ${product.price}{' '}
              <span className="text-xs text-slate-400 font-normal">Free Shipping</span>
            </div>

            <p className="text-slate-300 text-sm leading-relaxed">
              {product.description ||
                'Engineered with cutting-edge Nike cushioning technology, offering lightweight support, breathability, and responsive energy return for everyday athletes.'}
            </p>

            {/* Size Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
                Select US Size
              </label>
              <div className="flex flex-wrap gap-3">
                {(product.sizes || [7, 8, 9, 10, 11, 12]).map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 rounded-xl font-bold text-sm border transition-all ${
                      selectedSize === size
                        ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/50 scale-105'
                        : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 px-8 rounded-2xl flex items-center justify-center gap-3 shadow-xl hover:shadow-blue-500/30 active:scale-95 transition-all text-sm uppercase tracking-wider"
              >
                <ShoppingBagIcon className="w-5 h-5" />
                <span>Add To Cart</span>
              </button>
            </div>

            {/* Guarantee Perks */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-700/60 text-center text-xs text-slate-400">
              <div className="flex flex-col items-center gap-1">
                <TruckIcon className="w-5 h-5 text-blue-400" />
                <span>Fast Express Delivery</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <ShieldCheckIcon className="w-5 h-5 text-emerald-400" />
                <span>100% Authentic Guarantee</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <ArrowPathIcon className="w-5 h-5 text-purple-400" />
                <span>30-Day Free Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-slate-800/40 border border-slate-700/60 rounded-3xl p-8 md:p-12">
          <h2 className="text-2xl font-bold mb-8">Customer Reviews ({reviews.length})</h2>

          {/* Submit Review Form */}
          <form onSubmit={handleReviewSubmit} className="bg-slate-900/80 p-6 rounded-2xl mb-10 border border-slate-700">
            <h3 className="text-base font-bold mb-4">Write a Review</h3>
            
            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-400 mb-2">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                  >
                    <StarIcon
                      className={`w-6 h-6 transition-colors ${
                        star <= rating ? 'text-amber-400' : 'text-slate-700'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <textarea
                rows="3"
                placeholder="Share your opinion about this shoe..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={submittingReview}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all"
            >
              {submittingReview ? 'Posting...' : 'Submit Review'}
            </button>
          </form>

          {/* Reviews List */}
          {reviews.length === 0 ? (
            <p className="text-slate-500 text-center py-6">No reviews yet. Be the first to review!</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((rev) => (
                <div key={rev._id} className="bg-slate-900/50 p-5 rounded-2xl border border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-xs">
                        {rev.user?.name ? rev.user.name[0].toUpperCase() : 'U'}
                      </div>
                      <span className="font-bold text-sm">{rev.user?.name || 'Customer'}</span>
                    </div>
                    <div className="flex items-center text-amber-400">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <StarIcon key={i} className="w-4 h-4" />
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-300 text-sm">{rev.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer footerApi={footerAPI} />
    </div>
  );
};

export default ProductDetailPage;
