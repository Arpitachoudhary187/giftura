import { Response } from 'express';
import crypto from 'crypto';
import { Order } from '../models/Order.model';
import { AuthRequest } from '../middleware/auth.middleware';

const getRazorpay = () => {
  const Razorpay = require('razorpay');
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_000000000000',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'testsecret000000000000',
  });
};

export const createRazorpayOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { amount, orderId } = req.body;
    const razorpay = getRazorpay();
    const rzpOrder = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: 'INR',
      receipt: `giftura_${orderId}`,
    });
    await Order.findByIdAndUpdate(orderId, { razorpayOrderId: rzpOrder.id });
    res.json({ razorpayOrderId: rzpOrder.id, amount: rzpOrder.amount, currency: rzpOrder.currency, key: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    res.status(500).json({ message: 'Payment initiation failed', error: err });
  }
};

export const verifyRazorpayPayment = async (req: AuthRequest, res: Response) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'testsecret000000000000')
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');
    if (expectedSignature !== razorpay_signature)
      return res.status(400).json({ message: 'Payment verification failed' });
    await Order.findByIdAndUpdate(orderId, {
      paymentId: razorpay_payment_id, currentStatus: 'processing',
      $push: { trackingHistory: { status: 'processing', message: 'Payment received', timestamp: new Date() } },
    });
    res.json({ success: true, message: 'Payment verified' });
  } catch (err) {
    res.status(500).json({ message: 'Verification error', error: err });
  }
};
