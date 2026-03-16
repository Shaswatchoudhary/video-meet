import { Cashfree, CFEnvironment } from "cashfree-pg";
import User from '../models/User.js';
import dotenv from 'dotenv';
dotenv.config();


const createOrder = async (req, res) => {
  try {
    const { plan, amount } = req.body;

    if (!['aarambh', 'samraat'].includes(plan)) {
      return res.status(400).json({ message: 'Invalid plan selected' });
    }

    const orderId = `order_${Date.now()}`;

    const request = {
      order_amount: amount,
      order_currency: "INR",
      order_id: orderId,
      customer_details: {
        customer_id: req.user._id.toString(),
        customer_phone: "9999999999", // Mock phone
        customer_email: req.user.email,
        customer_name: req.user.name
      },
      order_meta: {
        notify_url: `${process.env.BACKEND_URL}/api/cashfree/webhook`,
        return_url: `${process.env.FRONTEND_URL}/`
      },
      order_note: `Subscription for ${plan} plan`
    };

    // Initialize Cashfree with credentials in constructor
    const cashfree = new Cashfree(
      process.env.CASHFREE_ENV === 'PRODUCTION' ? CFEnvironment.PRODUCTION : CFEnvironment.SANDBOX,
      process.env.CASHFREE_APP_ID,
      process.env.CASHFREE_SECRET_KEY
    );

    const response = await cashfree.PGCreateOrder(request);

    if (response && response.data) {
      res.json({
        payment_session_id: response.data.payment_session_id,
        order_id: response.data.order_id,
        cf_order_id: response.data.cf_order_id
      });
    } else {
      res.status(500).json({ message: 'Could not create Cashfree order' });
    }
  } catch (error) {
    console.error('Error creating Cashfree order:', error.response?.data || error.message);
    res.status(500).json({
      message: 'Cashfree Order Error',
      error: error.response?.data?.message || error.message
    });
  }
};

//verify payment
const verifyPayment = async (req, res) => {
  try {
    const { order_id, plan, period = 'yearly' } = req.body;

    const cashfree = new Cashfree(
      CFEnvironment.SANDBOX,
      process.env.CASHFREE_APP_ID,
      process.env.CASHFREE_SECRET_KEY
    );

    const response = await cashfree.PGOrderFetchPayments(order_id);
    const payments = response.data;

    // Check if any payment is successful
    const successfulPayment = payments.find(p => p.payment_status === "SUCCESS");

    if (successfulPayment) {
      // Update user subscription
      const user = await User.findById(req.user._id);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      console.log(`Processing ${period} subscription for user: ${user.email}, order: ${order_id}`);

      let durationDays = 365;
      if (period === 'monthly') durationDays = 30;
      else if (period === '6month') durationDays = 180;

      const now = new Date();
      let currentEnd = user.subscriptionEnd ? new Date(user.subscriptionEnd) : now;

      if (currentEnd < now) {
        currentEnd = now;
      }

      if (period === 'yearly') {
        currentEnd.setFullYear(currentEnd.getFullYear() + 1);
      } else {
        currentEnd.setDate(currentEnd.getDate() + durationDays);
      }

      user.subscriptionPlan = plan;
      user.planName = plan === 'samraat' ? 'Samraat' : 'Aarambh';
      user.subscriptionStatus = 'active';
      user.amountPaid = successfulPayment.payment_amount;
      user.paymentId = successfulPayment.cf_payment_id;
      user.orderId = order_id;

      if (!user.subscriptionStart || new Date(user.subscriptionEnd) < now) {
        user.subscriptionStart = now;
      }
      user.subscriptionEnd = currentEnd;
      user.nextBillingDate = currentEnd;

      await user.save();

      console.log(`Subscription updated. New end date: ${user.subscriptionEnd}`);

      res.json({
        success: true,
        message: 'Payment verified successfully and profile updated',
        subscription: {
          plan: user.subscriptionPlan,
          planName: user.planName,
          startDate: user.subscriptionStart,
          endDate: user.subscriptionEnd,
          isActive: true
        }
      });
    } else {
      res.status(400).json({ success: false, message: 'Payment not successful or pending' });
    }
  } catch (error) {
    console.error('Error verifying Cashfree payment:', error.response?.data || error.message);
    res.status(500).json({ message: 'Verification error' });
  }
};

export { createOrder, verifyPayment };
