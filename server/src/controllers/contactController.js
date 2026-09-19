import { query } from '../config/db.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const NAME_REGEX = /^[a-zA-ZçÇğĞıİöÖşŞüÜ\s'-]{2,}$/;

export const submitContactMessage = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !NAME_REGEX.test(name.trim())) {
      return res.status(400).json({ success: false, message: 'Geçersiz ad soyad. Sadece harfler kullanılabilir (en az 2 karakter).' });
    }

    if (!email || !EMAIL_REGEX.test(email.trim())) {
      return res.status(400).json({ success: false, message: 'Geçerli bir e-posta adresi giriniz.' });
    }

    if (phone && phone.trim()) {
      const cleanPhone = phone.trim().replace(/\D/g, '');
      if (cleanPhone.length < 10 || cleanPhone.length > 12) {
        return res.status(400).json({ success: false, message: 'Geçerli bir telefon numarası giriniz.' });
      }
    }

    if (!subject || subject.trim().length < 3) {
      return res.status(400).json({ success: false, message: 'Konu en az 3 karakter olmalıdır.' });
    }

    if (!message || message.trim().length < 10) {
      return res.status(400).json({ success: false, message: 'Mesajınız en az 10 karakter olmalıdır.' });
    }

    const result = await query(
      `INSERT INTO contact_messages (name, email, phone, subject, message)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [name.trim(), email.trim().toLowerCase(), phone ? phone.trim() : '', subject.trim(), message.trim()]
    );

    res.status(201).json({
      success: true,
      message: 'Mesajınız başarıyla iletildi. En kısa sürede sizinle iletişime geçeceğiz.',
      contactMessage: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminContactMessages = async (req, res, next) => {
  try {
    const result = await query('SELECT * FROM contact_messages ORDER BY created_at DESC');
    const messages = result.rows.map(r => ({
      _id: String(r.id),
      name: r.name,
      email: r.email,
      phone: r.phone,
      subject: r.subject,
      message: r.message,
      isRead: r.is_read,
      createdAt: r.created_at
    }));
    res.json({ success: true, messages });
  } catch (error) {
    next(error);
  }
};

export const getContactMessages = getAdminContactMessages;

export const updateAdminContactStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isRead } = req.body;
    const result = await query(
      'UPDATE contact_messages SET is_read = COALESCE($1, TRUE) WHERE id = $2 RETURNING *',
      [isRead, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Mesaj bulunamadı.' });
    }
    res.json({ success: true, message: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

export const markMessageAsRead = updateAdminContactStatus;
