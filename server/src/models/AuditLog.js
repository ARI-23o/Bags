import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    default: null
  },
  adminEmail: {
    type: String,
    default: 'system'
  },
  action: {
    type: String,
    required: true // e.g. "CREATE_PRODUCT", "UPDATE_ORDER_STATUS", "UPDATE_SETTINGS"
  },
  targetResource: {
    type: String,
    required: true // e.g. "Product", "Order", "SiteSettings"
  },
  targetId: {
    type: String,
    default: null
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  ipAddress: {
    type: String,
    default: ''
  },
  userAgent: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

const AuditLog = mongoose.model('AuditLog', auditLogSchema);
export default AuditLog;
