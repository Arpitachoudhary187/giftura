import { Router } from 'express';
import { createRazorpayOrder, verifyRazorpayPayment } from '../controllers/payment.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();
router.use(protect);
router.post('/razorpay/create', createRazorpayOrder);
router.post('/razorpay/verify', verifyRazorpayPayment);
export default router;
