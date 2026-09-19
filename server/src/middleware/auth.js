import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'nehir_canta_secret_key_2026';

// Protect Admin routes
export const protectAdmin = async (req, res, next) => {
  try {
    let token = null;

    if (req.cookies && req.cookies.adminToken) {
      token = req.cookies.adminToken;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Yetkilendirme hatası: Lütfen giriş yapınız.'
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const admin = await Admin.findById(decoded.id);

    if (!admin || !admin.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Yetkisiz erişim: Yönetici hesabı bulunamadı veya pasif.'
      });
    }

    req.admin = admin;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Geçersiz veya süresi dolmuş oturum. Lütfen tekrar giriş yapınız.'
    });
  }
};

// Check Admin Role
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.admin || !roles.includes(req.admin.role)) {
      return res.status(403).json({
        success: false,
        message: 'Bu işlem için yetkiniz bulunmamaktadır.'
      });
    }
    next();
  };
};

// Protect Customer User routes
export const protectUser = async (req, res, next) => {
  try {
    let token = null;

    if (req.cookies && req.cookies.userToken) {
      token = req.cookies.userToken;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Lütfen kullanıcı girişi yapınız.'
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Kullanıcı hesabı bulunamadı veya pasif durumda.'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Geçersiz oturum.'
    });
  }
};
