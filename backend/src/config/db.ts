import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/softdeals_sms';
    const conn = await mongoose.connect(mongoUri, {
      dbName: 'softdeals_sms',
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error('[Database] MongoDB Connection Failed:', error);
    process.exit(1);
  }
};
