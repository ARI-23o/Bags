export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log to console in non-production
  if (process.env.NODE_ENV !== 'production') {
    console.error(`[Error] ${err.name || 'Server Error'}: ${err.message}`);
  }

  // Mongoose bad ObjectId / CastError
  if (err.name === 'CastError') {
    const message = 'Geçersiz kaynak kimliği (ID) formatı.';
    return res.status(400).json({ success: false, message });
  }

  // Mongoose duplicate key error (code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'alan';
    const message = `Bu ${field} değeri zaten kullanılıyor.`;
    return res.status(400).json({ success: false, message });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({
      success: false,
      message: messages.join(', ') || 'Form doğrulama hatası.'
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Geçersiz kimlik doğrulama belirteci.'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Oturum süreniz doldu. Lütfen tekrar giriş yapınız.'
    });
  }

  // Default response
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: error.message || 'Sunucu tarafında beklenmedik bir hata oluştu. Lütfen tekrar deneyiniz.'
  });
};
