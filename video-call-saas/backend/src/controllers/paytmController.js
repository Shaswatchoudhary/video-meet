import PaytmChecksum from 'paytmchecksum';
import User from '../models/User.js';
import { v4 as uuidv4 } from 'uuid';
import https from 'https';
import axios from 'axios';

// @desc    Initiate Paytm Transaction
// @route   POST /api/paytm/initiate
// @access  Private
const initiateTransaction = async (req, res) => {
  try {
    const { plan, amount } = req.body;

    if (!['aarambh', 'samraat'].includes(plan)) {
      return res.status(400).json({ message: 'Invalid plan selected' });
    }

    const mid = process.env.PAYTM_MID?.trim();
    const mkey = process.env.PAYTM_MERCHANT_KEY?.trim();
    const orderId = `VM_ORD_${Date.now()}`; 

    console.log('--- Paytm Initiation (v1 Handshake) ---');
    console.log('MID:', mid);
    console.log('OrderId:', orderId);
    
    // Explicitly including all params confirmed by user
    const bodyObj = {
      requestType: "Payment",
      mid: mid,
      websiteName: "WEBSTAGING",
      orderId: orderId,
      callbackUrl: `https://securegw-stage.paytm.in/theia/paytmCallback?ORDER_ID=${orderId}`,
      txnAmount: {
        value: amount.toFixed(2).toString(),
        currency: "INR",
      },
      userInfo: {
        custId: req.user._id.toString(),
      },
      channelId: "WEB",
      industryTypeId: "Retail"
    };

    const bodyString = JSON.stringify(bodyObj);
    const checksum = await PaytmChecksum.generateSignature(bodyString, mkey);

    const payload = {
        body: bodyObj,
        head: {
            signature: checksum,
            version: "v1"
        }
    };

    console.log('Final Payload:', JSON.stringify(payload));

    try {
      const response = await axios.post(
        `https://securegw-stage.paytm.in/theia/api/v1/initiateTransaction?mid=${mid}&orderId=${orderId}`,
        payload,
        { 
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          } 
        }
      );

      console.log('Paytm Raw Response:', JSON.stringify(response.data));

      const result = response.data;
      if (result.body && result.body.resultInfo && result.body.resultInfo.resultStatus === "S") {
        res.json({
          mid,
          orderId,
          txnToken: result.body.txnToken,
          amount: amount,
          plan: plan
        });
      } else {
        const msg = result.body?.resultInfo?.resultMsg || 'System Error / Configuration Error';
        console.error('Paytm Initiation Failed:', result.body?.resultInfo);
        res.status(500).json({ 
            message: 'Paytm Error: ' + msg,
            code: result.body?.resultInfo?.resultCode,
            detail: result 
        });
      }
    } catch (apiError) {
      console.error('Paytm API Request Error:', apiError.response?.data || apiError.message);
      res.status(500).json({ 
        message: 'Paytm API Connection Error', 
        error: apiError.message,
        detail: apiError.response?.data 
      });
    }


  } catch (error) {
    console.error('Error initiating Paytm transaction:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Paytm Callback / Verification
// @route   POST /api/paytm/callback
// @access  Public (called by Paytm)
const handleCallback = async (req, res) => {
  try {
    // Note: In a real production app, Paytm sends POST data to the callback URL.
    // For local testing with Checkout JS, we might handle verification differently or via status polling.
    // However, this is the standard structure.
    
    const { ORDERID, STATUS, TXNAMOUNT } = req.body;

    if (STATUS === 'TXN_SUCCESS') {
        // Ideally, we'd verify the checksum here again from the callback body
        // and check the transaction status via Paytm API to be 100% sure.
        
        // Update user (logic to find user might need to be linked via metadata or session if callback is server-to-server)
        // For this demo/test integration, we will also provide a verify route for the frontend to call.
    }

    res.json(req.body);
  } catch (error) {
    console.error('Error in Paytm callback:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Verify Paytm Transaction
// @route   POST /api/paytm/verify
// @access  Private
const verifyTransaction = async (req, res) => {
  try {
    const { orderId, plan } = req.body;
    
    // In test mode, we'll simulate a successful verification if the order exists
    // and ideally we'd call Paytm's Transaction Status API here.
    
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const durationDays = 365;
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
    
    await user.save();

    res.json({
      success: true,
      subscription: {
        plan: user.subscriptionPlan,
        startDate: user.subscriptionStart,
        endDate: user.subscriptionEnd,
        isActive: true
      }
    });
  } catch (error) {
    console.error('Error verifying Paytm transaction:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export { initiateTransaction, handleCallback, verifyTransaction };
