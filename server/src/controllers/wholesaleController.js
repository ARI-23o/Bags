import WholesaleEnquiry from '../models/WholesaleEnquiry.js';
import { logAudit } from '../middleware/auditLogger.js';

// @desc    Submit wholesale B2B enquiry
// @route   POST /api/wholesale
// @access  Public
export const submitWholesaleEnquiry = async (req, res, next) => {
  try {
    const {
      companyName,
      contactName,
      email,
      phone,
      city,
      country,
      businessType,
      taxId,
      taxOffice,
      instagramHandle,
      website,
      estimatedVolume,
      message
    } = req.body;

    if (!companyName || !contactName || !email || !phone || !city || !message) {
      return res.status(400).json({
        success: false,
        message: 'Lütfen zorunlu alanları (Firma, Yetkili, E-posta, Telefon, Şehir, Mesaj) eksiksiz doldurunuz.'
      });
    }

    const enquiry = await WholesaleEnquiry.create({
      companyName,
      contactName,
      email: email.toLowerCase().trim(),
      phone,
      city,
      country: country || 'Türkiye',
      businessType: businessType || 'Fiziksel Butik / Mağaza',
      taxId: taxId || '',
      taxOffice: taxOffice || '',
      instagramHandle: instagramHandle || '',
      website: website || '',
      estimatedVolume: estimatedVolume || '25-50 Adet / Ay',
      message
    });

    res.status(201).json({
      success: true,
      message: 'Toptan satış başvurunuz başarıyla alındı. Satış ekibimiz en kısa sürede sizinle iletişime geçecektir.',
      enquiry
    });
  } catch (error) {
    next(error);
  }
};

// ================= ADMIN WHOLESALE CONTROLLERS =================

// @desc    Admin: Get all wholesale enquiries
// @route   GET /api/wholesale/admin/all
// @access  Private (Admin)
export const getAdminWholesaleEnquiries = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { companyName: regex },
        { contactName: regex },
        { email: regex },
        { phone: regex },
        { city: regex }
      ];
    }

    const enquiries = await WholesaleEnquiry.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: enquiries.length,
      enquiries
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Update wholesale status
// @route   PUT /api/wholesale/admin/:id
// @access  Private (Admin)
export const updateAdminWholesaleStatus = async (req, res, next) => {
  try {
    const { status, adminNotes } = req.body;
    const enquiry = await WholesaleEnquiry.findById(req.params.id);

    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Başvuru bulunamadı.' });
    }

    if (status) enquiry.status = status;
    if (adminNotes !== undefined) enquiry.adminNotes = adminNotes;

    await enquiry.save();
    await logAudit(req, 'UPDATE_WHOLESALE_STATUS', 'WholesaleEnquiry', enquiry._id, { status, company: enquiry.companyName });

    res.status(200).json({
      success: true,
      message: 'Toptan satış başvurusu güncellendi.',
      enquiry
    });
  } catch (error) {
    next(error);
  }
};
