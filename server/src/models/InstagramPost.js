import mongoose from 'mongoose';

const instagramPostSchema = new mongoose.Schema({
  mediaUrl: {
    type: String,
    required: [true, 'Görsel URL zorunludur.']
  },
  permalink: {
    type: String,
    default: 'https://www.instagram.com/nehircanta2016/'
  },
  caption: {
    type: String,
    default: ''
  },
  likes: {
    type: Number,
    default: 0
  },
  productSlug: {
    type: String,
    default: ''
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  }
}, {
  timestamps: true
});

const InstagramPost = mongoose.model('InstagramPost', instagramPostSchema);
export default InstagramPost;
