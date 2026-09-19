import Coupon from '../models/Coupon.js';
import { logAudit } from '../middleware/auditLogger.js';

// @desc    Validate coupon code for checkout
// @route   POST /api/coupons/validate
// @access  Public
export const validateCoupon = async (req, res, next) => {
  try {
    const { code, cartSubtotal } = req.body;

    if (!code || !code.trim()) {
      return res.status(400).json({ success: false, message: 'Lütfen kupon kodunu giriniz.' });
    }

    const coupon = await Coupon.findOne({
      code: code.toUpperCase().trim(),
      isActive: true
    });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Geçersiz veya süresi dolmuş kupon kodu.'
      });
    }

    const now = new Date();
    if (coupon.expiresAt && new Date(coupon.expiresAt) < now) {
      return res.status(400).json({
        success: false,
        message: 'Bu kupon kodunun kullanım süresi dolmuştur.'
      });
    }

    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      return res.status(400).json({
        success: false,
        message: 'Bu kupon kodu kullanım limitine ulaşmıştır.'
      });
    }

    const subtotal = Number(cartSubtotal) || 0;
    if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
      return res.status(400).json({
        success: false,
        message: `Bu kupon en az ₺${coupon.minOrderAmount.toFixed(2)} tutarındaki siparişlerde geçerlidir.`
      });
    }

    let discountAmount = 0;
    if (coupon.discountType === 'percent') {
      discountAmount = (subtotal * coupon.discountValue) / 100;
      if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
        discountAmount = coupon.maxDiscountAmount;
      }
    } else {
      discountAmount = Math.min(coupon.discountValue, subtotal);
    }

    res.status(200).json({
      success: true,
      message: 'Kupon kodu başarıyla uygulandı.',
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount
      }
    });
  } catch (error) {
    next(error);
  }
};

// ================= ADMIN COUPON CONTROLLERS =================

// @desc    Admin: Get all coupons
// @route   GET /api/coupons/admin/all
// @access  Private (Admin)
export const getAdminCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, coupons });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Create coupon
// @route   POST /api/coupons
// @access  Private (Admin)
export const createCoupon = async (req, res, next) => {
  try {
    const data = { ...req.body };
    data.code = data.code.toUpperCase().trim();

    const coupon = await Coupon.create(data);
    await logAudit(req, 'CREATE_COUPON', 'Coupon', coupon._id, { code: coupon.code });

    res.status(201).json({
      success: true,
      message: 'Kupon başarıyla oluşturuldu.',
      coupon
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Update coupon
// @route   PUT /api/coupons/:id
// @access  Private (Admin)
export const updateCoupon = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (data.code) data.code = data.code.toUpperCase().trim();

    const coupon = await Coupon.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true
    });

    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Kupon bulunamadı.' });
    }

    await logAudit(req, 'UPDATE_COUPON', 'Coupon', coupon._id, { code: coupon.code });

    res.status(200).json({
      success: true,
      message: 'Kupon güncellendi.',
      coupon
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Delete coupon
// @route   DELETE /api/coupons/:id
// @access  Private (Admin)
export const deleteCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Kupon bulunamadı.' });
    }

    await logAudit(req, 'DELETE_COUPON', 'Coupon', req.params.id, {});

    res.status(200).json({ success: true, message: 'Kupon silindi.' });
  } catch (error) {
    next(error);
  }
};
