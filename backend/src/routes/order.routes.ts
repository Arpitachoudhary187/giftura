import { Router } from 'express';
import { placeOrder, getMyOrders, getOrder, getAllOrders, updateOrderStatus } from '../controllers/order.controller';
import { protect, adminOnly } from '../middleware/auth.middleware';

const router = Router();
router.use(protect);
router.post('/', placeOrder);
router.get('/my', getMyOrders);
router.get('/:id', getOrder);
router.get('/', adminOnly, getAllOrders);
router.put('/:id/status', adminOnly, updateOrderStatus);
export default router;
