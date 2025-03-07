import express from 'express';
import { register, login, getCurrentUser, forgotPassword, resetPassword } from '../controllers/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/user', authMiddleware, getCurrentUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', authMiddleware, resetPassword);

export default router;