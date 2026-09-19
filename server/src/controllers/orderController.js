import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Coupon from '../models/Coupon.js';
import SiteSettings from '../models/SiteSettings.js';
import { logAudit } from '../middleware/auditLogger.js';

// Helper to generate unique order number
const generateOrderNumber = () => {
  const date = new Date();
  const year = date.getFullYear();
  const random = Math.floor(100000 + Math.random() * 900000);
  return `NC-${year}-${random}`;
};

// @desc    Create new customer order
// @route   POST /api/orders
// @access  Public
export const createOrder = async (req, res, next) => {
  try {
    const {
      customer,
      shippingAddress,
      items,
      couponCode,
      paymentMethod,
      notes
    } = req.body;

    if (!customer || !shippingAddress || !items || !items.length || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: 'Lütfen sipariş için gerekli tüm bilgileri eksiksiz doldurunuz.'
      });
    }

    // Verify products and calculate exact subtotal
    let calculatedSubtotal = 0;
    const verifiedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId || item.product);
      if (!product || product.status !== 'active') {
        return res.status(400).json({
          success: false,
          message: `"${item.title || 'Ürün'}" artık satışta bulunmamaktadır.`
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `"${product.title}" için yeterli stok bulunmuyor. (Mevcut stok: ${product.stock})`
        });
      }

      const itemTotal = product.price * item.quantity;
      calculatedSubtotal += itemTotal;

      verifiedItems.push({
        product: product._id,
        title: product.title,
        sku: product.sku,
        color: item.color || { name: '', hexCode: '' },
        price: product.price,
        quantity: item.quantity,
        image: item.image || product.primaryImage,
        totalPrice: itemTotal
      });
    }

    // Calculate shipping fee from site settings
    const settings = await SiteSettings.findOne();
    let shippingFee = 0;
    if (settings && settings.shippingSettings) {
      const { standardRate, freeShippingThreshold, isFreeShippingEnabled } = settings.shippingSettings;
      if (isFreeShippingEnabled && calculatedSubtotal >= freeShippingThreshold) {
        shippingFee = 0;
      } else {
        shippingFee = standardRate || 0;
      }
    }

    // Additional cash on delivery fee if applicable
    if (paymentMethod === 'kapida_odeme' && settings?.paymentMethods?.kapidaOdemeFee) {
      shippingFee += settings.paymentMethods.kapidaOdemeFee;
    }

    // Calculate coupon discount
    let discountAmount = 0;
    let appliedCoupon = null;

    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: couponCode.toUpperCase().trim(),
        isActive: true
      });

      if (coupon) {
        const now = new Date();
        const isNotExpired = !coupon.expiresAt || new Date(coupon.expiresAt) > now;
        const isUnderLimit = !coupon.maxUses || coupon.usedCount < coupon.maxUses;
        const meetsMinAmount = calculatedSubtotal >= (coupon.minOrderAmount || 0);

        if (isNotExpired && isUnderLimit && meetsMinAmount) {
          if (coupon.discountType === 'percent') {
            discountAmount = (calculatedSubtotal * coupon.discountValue) / 100;
            if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
              discountAmount = coupon.maxDiscountAmount;
            }
          } else {
            discountAmount = Math.min(coupon.discountValue, calculatedSubtotal);
          }

          appliedCoupon = coupon;
        }
      }
    }

    const total = Math.max(0, calculatedSubtotal + shippingFee - discountAmount);
    const orderNumber = generateOrderNumber();

    const order = await Order.create({
      orderNumber,
      customer,
      shippingAddress,
      items: verifiedItems,
      subtotal: calculatedSubtotal,
      shippingFee,
      discountAmount,
      couponCode: appliedCoupon ? appliedCoupon.code : null,
      total,
      paymentMethod,
      notes: notes || ''
    });

    // Deduct stock for ordered items
    for (const item of items) {
      await Product.findByIdAndUpdate(item.productId || item.product, {
        $inc: { stock: -item.quantity }
      });
    }

    // Increment coupon used count if used
    if (appliedCoupon) {
      appliedCoupon.usedCount += 1;
      await appliedCoupon.save();
    }

    res.status(201).json({
      success: true,
      message: 'Siparişiniz başarıyla alındı.',
      order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Track order by orderNumber and email or phone
// @route   GET /api/orders/track
// @access  Public
export const trackOrder = async (req, res, next) => {
  try {
    const { orderNumber, contact } = req.query;

    if (!orderNumber || !contact) {
      return res.status(400).json({
        success: false,
        message: 'Lütfen sipariş numarası ve telefon/e-posta bilginizi giriniz.'
      });
    }

    const trimmedOrder = orderNumber.toUpperCase().trim();
    const trimmedContact = contact.toLowerCase().trim();

    const order = await Order.findOne({
      orderNumber: trimmedOrder,
      $or: [
        { 'customer.email': trimmedContact },
        { 'customer.phone': new RegExp(trimmedContact.replace(/\D/g, ''), 'i') }
      ]
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Belirtilen bilgilerle eşleşen bir sipariş bulunamadı.'
      });
    }

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    next(error);
  }
};

// ================= ADMIN ORDER CONTROLLERS =================

// @desc    Admin: Get all orders with status filter & pagination
// @route   GET /api/orders/admin/all
// @access  Private (Admin)
export const getAdminOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.orderStatus = status;
    }

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { orderNumber: regex },
        { 'customer.firstName': regex },
        { 'customer.lastName': regex },
        { 'customer.email': regex },
        { 'customer.phone': regex }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Get order details
// @route   GET /api/orders/admin/:id
// @access  Private (Admin)
export const getAdminOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Sipariş bulunamadı.' });
    }
    res.status(200).json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Update order status / tracking
// @route   PUT /api/orders/admin/:id
// @access  Private (Admin)
export const updateAdminOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus, paymentStatus, trackingNumber, trackingCarrier, adminNotes } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Sipariş bulunamadı.' });
    }

    if (orderStatus) order.orderStatus = orderStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    if (trackingNumber !== undefined) order.trackingNumber = trackingNumber;
    if (trackingCarrier !== undefined) order.trackingCarrier = trackingCarrier;
    if (adminNotes !== undefined) order.adminNotes = adminNotes;

    await order.save();

    await logAudit(req, 'UPDATE_ORDER_STATUS', 'Order', order._id, {
      orderNumber: order.orderNumber,
      orderStatus: order.orderStatus,
      paymentStatus: order.paymentStatus,
      trackingNumber: order.trackingNumber
    });

    res.status(200).json({
      success: true,
      message: 'Sipariş durumu başarıyla güncellendi.',
      order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Get dashboard statistics
// @route   GET /api/orders/admin/stats
// @access  Private (Admin)
export const getAdminDashboardStats = async (req, res, next) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ orderStatus: 'pending' });
    const processingOrders = await Order.countDocuments({ orderStatus: { $in: ['confirmed', 'processing'] } });
    const shippedOrders = await Order.countDocuments({ orderStatus: 'shipped' });
    const deliveredOrders = await Order.countDocuments({ orderStatus: 'delivered' });

    // Revenue calculation
    const revenueAgg = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'cancelled' } } },
      { $group: { _id: null, totalRevenue: { $sum: '$total' } } }
    ]);
    const totalRevenue = revenueAgg[0]?.totalRevenue || 0;

    // Total products & low stock
    const totalProducts = await Product.countDocuments({ status: 'active' });
    const lowStockProducts = await Product.find({ status: 'active', stock: { $lte: 3 } })
      .select('title sku stock price primaryImage')
      .limit(6);

    // Recent 5 orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      stats: {
        totalOrders,
        pendingOrders,
        processingOrders,
        shippedOrders,
        deliveredOrders,
        totalRevenue,
        totalProducts,
        lowStockCount: lowStockProducts.length
      },
      lowStockProducts,
      recentOrders
    });
  } catch (error) {
    next(error);
  }
};
