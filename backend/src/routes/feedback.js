import { Router } from 'express';
import {
  createFeedback,
  getAllFeedbacks,
  markFeedbackRead,
} from '../controllers/feedbackController.js';
import authMiddleware from '../middleware/auth.js';
import adminOnly from '../middleware/adminOnly.js';
import { validateFeedback } from '../middleware/validate.js';

const router = Router();

// Feedback routes: Public submissions and admin management
router.post('/', validateFeedback, createFeedback);
router.get('/', authMiddleware, adminOnly, getAllFeedbacks);
router.patch('/:id/read', authMiddleware, adminOnly, markFeedbackRead);

export default router;
