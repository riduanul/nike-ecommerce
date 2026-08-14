import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: {
    type: String,
    required: true,
  },
  title: { type: String, required: true },
  img: { type: String, required: true },
  price: { type: Number, required: true },
  qty: { type: Number, required: true, min: 1 },
  size: { type: Number, default: 10 },
  color: { type: String, default: '' },
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  orderItems: [orderItemSchema],
  shippingAddress: {
    fullName: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true },
    phone: { type: String, default: '' },
  },
  paymentMethod: {
    type: String,
    enum: ['stripe', 'cod'],
    default: 'cod',
  },
  paymentResult: {
    id: String,
    status: String,
    updateTime: String,
    emailAddress: String,
  },
  itemsPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  taxPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  shippingPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
  paidAt: Date,
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  deliveredAt: Date,
}, {
  timestamps: true,
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
