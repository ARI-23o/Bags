import express from 'express';
import { upload } from '../middleware/upload.js';
import { protectAdmin } from '../middleware/auth.js';

const router = express.Router();

// Upload single image
router.post('/single', protectAdmin, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Lütfen bir görsel dosyası seçiniz.' });
    }

    // Build accessible URL
    const fileUrl = `/uploads/${req.file.filename}`;

    res.status(200).json({
      success: true,
      message: 'Görsel başarıyla yüklendi.',
      url: fileUrl,
      filename: req.file.filename
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Upload multiple images
router.post('/multiple', protectAdmin, upload.array('images', 8), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'Lütfen en az bir görsel dosyası seçiniz.' });
    }

    const urls = req.files.map(file => `/uploads/${file.filename}`);

    res.status(200).json({
      success: true,
      message: `${urls.length} görsel başarıyla yüklendi.`,
      urls
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
