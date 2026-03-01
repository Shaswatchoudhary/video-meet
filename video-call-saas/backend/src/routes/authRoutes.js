const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const subscriptionMiddleware = require('../middleware/subscriptionMiddleware');
const { createMeeting } = require('../controllers/meetingController');


const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/meeting', protect, subscriptionMiddleware, createMeeting);

module.exports = router;
