import express from 'express';
import {
  createMeeting,
  joinMeeting,
  scheduleMeeting,
  getUpcomingMeetings,
  getRecentMeetings
} from '../controllers/meetingController.js';
import { protect } from '../middleware/authMiddleware.js';
import subscriptionMiddleware from '../middleware/subscriptionMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/create', subscriptionMiddleware, createMeeting);
router.post('/join', joinMeeting);
router.post('/schedule', scheduleMeeting);
router.get('/upcoming', getUpcomingMeetings);
router.get('/recent', getRecentMeetings);

export default router;
