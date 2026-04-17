import { Response } from 'express';
import { Order } from '../models/Order.model';
import { Cart } from '../models/Cart.model';
import { Product } from '../models/Product.model';
import { AuthRequest } from '../middleware/auth.middleware';

const COUPONS: Record<string, number> = { GIFT20: 200, DIWALI: 500, FIRST100: 100 };

export const placeOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { shippingAddress, paymentMethod, couponCode, giftMessage } = req.body;
    const cart = await Cart.findOne({ user: req.user!.userId }).populate('items.product');
    if (!cart || cart.items.length === 0) return res.status(400).json({ message: 'Cart is empty' });
    const discount = couponCode ? (COUPONS[couponCode.toUpperCase()] || 0) : 0;
    const totalAmount = Math.max(0, cart.totalAmount - discount);
    const orderItems = cart.items.map((item: any) => ({
      product: item.product._id, name: item.product.name,
      price: item.price, quantity: item.quantity, image: item.product.images?.[0] || '',
    }));
    const order = await Order.create({
      user: req.user!.userId, items: orderItems, totalAmount, discount,
      couponCode, shippingAddress, paymentMethod, giftMessage,
      trackingHistory: [{ status: 'placed', message: 'Order placed successfully', timestamp: new Date() }],
    });
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
    }
    await Cart.findOneAndUpdate({ user: req.user!.userId }, { items: [], totalAmount: 0 });
    res.status(201).json(order);
  } catch (err) { res.status(500).json({ message: 'Server error', error: err }); }
};

export const getMyOrders = async (req: AuthRequest, res: Response) => {
  try {
    const orders = await Order.find({ user: req.user!.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
};

export const getOrder = async (req: AuthRequest, res: Response) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user!.userId });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
};

export const getAllOrders = async (_req: AuthRequest, res: Response) => {
  try {
    const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
};

export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { status, message, location } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { currentStatus: status, $push: { trackingHistory: { status, message, timestamp: new Date(), location } } },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
};
