import dotenv from 'dotenv';
dotenv.config();

export default {
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_EXPIRE: '1d',
  JWT_REFRESH_EXPIRE: '7d',
  MONGODB_URI: process.env.MONGODB_URI,
  SMTP_HOST: 'smtp.gmail.com',
  SMTP_PORT: 587,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000'
}; 