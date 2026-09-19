import mongoose from 'mongoose';

const contactMessageSchema = new mongoose.Schema({
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
  phone: {
    type: String,
    default: ''
  },
  subject: {
    type: String,
    required: [true, 'Konu zorunludur.'],
    trim: true
  },
  message: {
    type: String,
    required: [true, 'Mesaj metni zorunludur.'],
    trim: true
  },
  isRead: {
    type: Boolean,
    default: false,
    index: true
  },
  status: {
    type: String,
    enum: ['new', 'in_progress', 'replied', 'closed'],
    default: 'new'
  },
  adminNotes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

const ContactMessage = mongoose.model('ContactMessage', contactMessageSchema);
export default ContactMessage;
