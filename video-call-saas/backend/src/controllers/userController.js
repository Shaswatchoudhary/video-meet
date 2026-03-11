import User from '../models/User.js';
import Meet from '../models/meet.js';

// Get User Subscription Details
export const getSubscriptionStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('subscriptionStatus planName nextBillingDate');
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Usage Analytics
export const getUsageAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;

    // Simple mock analytics for now based on Meet model
    const totalMeetings = await Meet.countDocuments({
      $or: [{ host: userId }, { participants: userId }]
    });

    const meetingsThisWeek = await Meet.countDocuments({
      $or: [{ host: userId }, { participants: userId }],
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    });

    // In a real app, you'd calculate actual hours from a 'calls' collection
    // Here we'll just return some realistic starting numbers
    res.json({
      totalMeetings,
      meetingsThisWeek,
      totalHours: (totalMeetings * 0.75).toFixed(1), // Mock: avg 45 mins per meeting
      participantsHosted: totalMeetings * 3 // Mock: avg 3 participants
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
