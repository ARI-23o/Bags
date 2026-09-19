import jwt from 'jsonwebtoken';
import { query } from '../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'nehir_canta_secret_key_2026';

// Protect Admin routes
export const protectAdmin = async (req, res, next) => {
  try {
    let token = null;

    if (req.cookies && (req.cookies.token || req.cookies.adminToken)) {
      token = req.cookies.token || req.cookies.adminToken;
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
    const result = await query('SELECT * FROM admins WHERE id = $1', [decoded.id]);

    if (result.rows.length === 0 || !result.rows[0].is_active) {
      return res.status(401).json({
        success: false,
        message: 'Yetkisiz erişim: Yönetici hesabı bulunamadı veya pasif.'
      });
    }

    const admin = result.rows[0];
    req.admin = {
      _id: String(admin.id),
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role
    };
    req.user = req.admin;
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
    const result = await query('SELECT * FROM users WHERE id = $1', [decoded.id]);

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Kullanıcı hesabı bulunamadı.'
      });
    }

    const user = result.rows[0];
    req.user = {
      _id: String(user.id),
      id: user.id,
      name: user.name,
      email: user.email
    };
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Geçersiz oturum.'
    });
  }
};
