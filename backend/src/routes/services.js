import { Router } from 'express';
import { getAllServices } from '../controllers/servicesController.js';

const router = Router();

// Services routes: Public catalog retrieval
router.get('/', getAllServices);

export default router;
