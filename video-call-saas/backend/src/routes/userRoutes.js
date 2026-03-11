import express from 'express';
import { getSubscriptionStatus, getUsageAnalytics } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/subscription', getSubscriptionStatus);
router.get('/analytics', getUsageAnalytics);

export default router;
