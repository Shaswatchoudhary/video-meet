import Razorpay from 'razorpay';
import crypto from 'crypto';
import User from '../models/User.js';

// @desc    Create Razorpay Order
// @route   POST /api/payments/create-order
// @access  Private
const createOrder = async (req, res) => {
  try {
    const { plan, amount } = req.body;

    if (!['aarambh', 'samraat'].includes(plan)) {
      return res.status(400).json({ message: 'Invalid plan selected' });
    }

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: amount * 100, // amount in smallest currency unit (paise)
      currency: 'INR',
      receipt: `receipt_order_${Date.now()}`,
    };

    const order = await instance.orders.create(options);

    if (!order) {
      return res.status(500).json({ message: 'Could not create order' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Verify Razorpay Payment
// @route   POST /api/payments/verify
// @access  Private
const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      plan
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isMatch = expectedSignature === razorpay_signature;

    if (isMatch) {
      // Update user subscription
      const user = await User.findById(req.user._id);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const durationDays = 365; // Yearly plan
      const now = new Date();
      let currentEnd = user.subscriptionEnd ? new Date(user.subscriptionEnd) : now;

      if (currentEnd < now) {
        currentEnd = now;
      }

      currentEnd.setDate(currentEnd.getDate() + durationDays);

      user.subscriptionPlan = plan;
      user.planName = plan === 'samraat' ? 'Samraat' : 'Aarambh';
      user.subscriptionStatus = 'active';
      if (!user.subscriptionStart || user.subscriptionEnd < now) {
        user.subscriptionStart = now;
      }
      user.subscriptionEnd = currentEnd;
      user.nextBillingDate = currentEnd;

      await user.save();

      res.json({
        success: true,
        message: 'Payment verified successfully',
        subscription: {
          plan: user.subscriptionPlan,
          startDate: user.subscriptionStart,
          endDate: user.subscriptionEnd,
          isActive: true
        }
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid signature' });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export { createOrder, verifyPayment };
