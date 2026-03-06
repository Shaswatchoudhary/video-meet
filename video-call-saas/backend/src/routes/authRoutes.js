import express from 'express';
import { registerUser, loginUser } from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';
import subscriptionMiddleware from '../middleware/subscriptionMiddleware';
import { createMeeting } from '../controllers/meetingController';


const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/meeting', protect, subscriptionMiddleware, createMeeting);

export default router;
