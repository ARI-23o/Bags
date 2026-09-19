import ContactMessage from '../models/ContactMessage.js';
import { logAudit } from '../middleware/auditLogger.js';

// @desc    Submit contact message
// @route   POST /api/contact
// @access  Public
export const submitContactMessage = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Lütfen zorunlu alanları (Ad Soyad, E-posta, Konu, Mesaj) doldurunuz.'
      });
    }

    const contact = await ContactMessage.create({
      name,
      email: email.toLowerCase().trim(),
      phone: phone || '',
      subject,
      message
    });

    res.status(201).json({
      success: true,
      message: 'Mesajınız başarıyla iletildi. Müşteri temsilcimiz en kısa sürede dönüş yapacaktır.',
      contact
    });
  } catch (error) {
    next(error);
  }
};

// ================= ADMIN CONTACT CONTROLLERS =================

// @desc    Admin: Get all contact messages
// @route   GET /api/contact/admin/all
// @access  Private (Admin)
export const getAdminContactMessages = async (req, res, next) => {
  try {
    const { status, isRead } = req.query;
    const query = {};

    if (status && status !== 'all') query.status = status;
    if (isRead !== undefined) query.isRead = isRead === 'true';

    const messages = await ContactMessage.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: messages.length,
      messages
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Update contact message status / read state
// @route   PUT /api/contact/admin/:id
// @access  Private (Admin)
export const updateAdminContactStatus = async (req, res, next) => {
  try {
    const { status, isRead, adminNotes } = req.body;
    const contact = await ContactMessage.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ success: false, message: 'Mesaj bulunamadı.' });
    }

    if (status) contact.status = status;
    if (isRead !== undefined) contact.isRead = isRead;
    if (adminNotes !== undefined) contact.adminNotes = adminNotes;

    await contact.save();
    await logAudit(req, 'UPDATE_CONTACT_STATUS', 'ContactMessage', contact._id, { status, isRead });

    res.status(200).json({
      success: true,
      message: 'Mesaj durumu güncellendi.',
      contact
    });
  } catch (error) {
    next(error);
  }
};
