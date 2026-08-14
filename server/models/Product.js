import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Product title is required'],
    trim: true,
  },
  text: {
    type: String,
    default: 'Running Shoes',
  },
  description: {
    type: String,
    default: '',
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price must be positive'],
  },
  rating: {
    type: String,
    default: '5+',
  },
  img: {
    type: String,
    required: [true, 'Product image is required'],
  },
  color: {
    type: String,
    default: 'from-blue-600 to-blue-500',
  },
  shadow: {
    type: String,
    default: 'shadow-lg shadow-blue-500',
  },
  category: {
    type: String,
    enum: ['running', 'basketball', 'lifestyle', 'training', 'soccer', 'skateboarding'],
    default: 'running',
  },
  brand: {
    type: String,
    default: 'Nike',
  },
  sizes: {
    type: [Number],
    default: [7, 8, 9, 10, 11, 12],
  },
  stock: {
    type: Number,
    default: 50,
    min: [0, 'Stock cannot be negative'],
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  isPopular: {
    type: Boolean,
    default: false,
  },
  numReviews: {
    type: Number,
    default: 0,
  },
  avgRating: {
    type: Number,
    default: 0,
  },
  btn: {
    type: String,
    default: 'Buy Now',
  },
}, {
  timestamps: true,
});

// Text index for search
productSchema.index({ title: 'text', text: 'text', description: 'text' });

const Product = mongoose.model('Product', productSchema);
export default Product;
