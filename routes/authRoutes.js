import express from 'express';
import {
  register,
  login,
  verifyEmail,
  resendOTP,
  changePassword,
  forgotPassword,
  verifyForgotPasswordOtp,
  resetPassword
} from '../controllers/authController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/verify-email', verifyEmail);
router.post('/resend-otp', resendOTP);
router.post('/forgot-password', forgotPassword);
router.post('/verify-forgot-password-otp', verifyForgotPasswordOtp);
router.post('/reset-password', resetPassword);

// Protected routes
router.post('/change-password', auth, changePassword);

export default router;