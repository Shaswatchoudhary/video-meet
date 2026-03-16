import express from 'express';
import { initiateTransaction, handleCallback, verifyTransaction } from '../controllers/paytmController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/initiate', protect, initiateTransaction);
router.post('/callback', handleCallback); // Paytm callback
router.post('/verify', protect, verifyTransaction);

export default router;
