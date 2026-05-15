import { Router } from 'express';
import {
  createApplication,
  getMyApplications,
  getApplicationById,
  updateApplicationStatus,
  getAllApplications,
} from '../controllers/applicationsController.js';
import authMiddleware from '../middleware/auth.js';
import adminOnly from '../middleware/adminOnly.js';
import { validateApplication } from '../middleware/validate.js';

const router = Router();

// Application routes: Handles public submissions and user-specific queries
router.post('/', validateApplication, createApplication);
router.get('/my', authMiddleware, getMyApplications);
router.get('/:id', authMiddleware, getApplicationById);

// Admin-only routes for processing and managing applications
router.patch('/:id/status', authMiddleware, adminOnly, updateApplicationStatus);
router.get('/', authMiddleware, adminOnly, getAllApplications);

export default router;
