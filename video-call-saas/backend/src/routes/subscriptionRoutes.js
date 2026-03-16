import express from 'express';
import {
  startSubscription,
  getSubscriptionStatus,
  upgradeSubscription
} from '../controllers/subscriptionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/start', protect, startSubscription);
router.get('/status', protect, getSubscriptionStatus);
router.post('/upgrade', protect, upgradeSubscription);

export default router;
