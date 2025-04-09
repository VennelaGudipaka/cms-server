import mongoose from 'mongoose';
import config from '../config/config.js';

export const connectDB = async () => {
  try {
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(config.MONGODB_URI);
    
    console.log('\x1b[32m%s\x1b[0m', '✓ Database connected successfully!');
    return conn;
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', '✗ Database connection error:');
    console.error(error.message);
    process.exit(1);
  }
}; 