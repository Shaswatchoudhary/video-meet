import User from '../models/User.js';

// @desc    Start a new subscription (aarambh or samraat)
// @route   POST /api/subscription/start
// @access  Private
const startSubscription = async (req, res) => {
  try {
    const { plan } = req.body;

    if (!['aarambh', 'samraat'].includes(plan)) {
      return res.status(400).json({ message: 'Invalid plan selected' });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const durationDays = 30; // 30 days for both demo plans
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + durationDays);

    user.subscriptionPlan = plan;
    user.subscriptionStart = startDate;
    user.subscriptionEnd = endDate;

    await user.save();

    res.json({
      plan: user.subscriptionPlan,
      startDate: user.subscriptionStart,
      endDate: user.subscriptionEnd,
      isActive: true,
      daysRemaining: durationDays
    });
  } catch (error) {
    console.error('Error starting subscription:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get subscription status
// @route   GET /api/subscription/status
// @access  Private
const getSubscriptionStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let daysRemaining = 0;
    let isActive = false;

    if (user.subscriptionEnd && user.subscriptionPlan !== 'none') {
      const now = new Date();
      const end = new Date(user.subscriptionEnd);
      const diffTime = end - now;
      daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
      isActive = daysRemaining > 0;
    }

    res.json({
      plan: user.subscriptionPlan || 'none',
      startDate: user.subscriptionStart || null,
      endDate: user.subscriptionEnd || null,
      daysRemaining,
      isActive
    });
  } catch (error) {
    console.error('Error getting subscription status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Upgrade subscription
// @route   POST /api/subscription/upgrade
// @access  Private
const upgradeSubscription = async (req, res) => {
  try {
    const { plan } = req.body || {};

    // In frontend, upgrade is usually to samraat
    const targetPlan = plan || 'samraat';

    if (targetPlan !== 'samraat') {
      return res.status(400).json({ message: 'Can only upgrade to samraat plan' });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const durationDays = 30;
    const now = new Date();
    let currentEnd = user.subscriptionEnd ? new Date(user.subscriptionEnd) : now;

    // If subscription already expired, start from today
    if (currentEnd < now) {
      currentEnd = now;
    }

    currentEnd.setDate(currentEnd.getDate() + durationDays);

    user.subscriptionPlan = targetPlan; 
    // If upgrading from none/expired, set start date to today
    if (!user.subscriptionStart || user.subscriptionEnd < now) {
      user.subscriptionStart = now;
    }
    user.subscriptionEnd = currentEnd;

    await user.save();

    // Calculate days remaining
    const diffTime = currentEnd - now;
    const daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    res.json({
      plan: user.subscriptionPlan,
      startDate: user.subscriptionStart,
      endDate: user.subscriptionEnd,
      isActive: true,
      daysRemaining
    });

  } catch (error) {
    console.error('Error upgrading subscription:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export {
  startSubscription,
  getSubscriptionStatus,
  upgradeSubscription
};
