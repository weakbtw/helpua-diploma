import { Router } from 'express';
import { register, login, getMe } from '../controllers/authController.js';
import authMiddleware from '../middleware/auth.js';
import { validateRegister, validateLogin } from '../middleware/validate.js';

const router = Router();

// Authentication routes: User registration, login, and session validation
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.get('/me', authMiddleware, getMe);

export default router;
