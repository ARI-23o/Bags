import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Ad Soyad zorunludur.'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'E-posta zorunludur.'],
    trim: true,
    lowercase: true
  },
  rating: {
    type: Number,
    required: [true, 'Puanlama zorunludur.'],
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: [true, 'Yorum zorunludur.'],
    trim: true
  },
  isVerifiedPurchase: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
    index: true
  }
}, {
  timestamps: true
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;
