import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/nehircanta');
    console.log(`[MongoDB] Bağlantı başarılı: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB] Bağlantı hatası: ${error.message}`);
    // Do not crash server in test/dev environment if mongo is offline
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};
