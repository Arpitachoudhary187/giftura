import { Response } from 'express';
import { Cart } from '../models/Cart.model';
import { Product } from '../models/Product.model';
import { AuthRequest } from '../middleware/auth.middleware';

export const getCart = async (req: AuthRequest, res: Response) => {
  try {
    const cart = await Cart.findOne({ user: req.user!.userId }).populate('items.product', 'name images price stock');
    res.json(cart || { items: [], totalAmount: 0 });
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
};

export const addToCart = async (req: AuthRequest, res: Response) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    let cart = await Cart.findOne({ user: req.user!.userId });
    if (!cart) cart = new Cart({ user: req.user!.userId, items: [] });
    const existing = cart.items.find((i) => i.product.toString() === productId);
    if (existing) existing.quantity += quantity;
    else cart.items.push({ product: productId, quantity, price: product.price });
    await cart.save();
    await cart.populate('items.product', 'name images price');
    res.json(cart);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
};

export const updateCartItem = async (req: AuthRequest, res: Response) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user!.userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    const item = cart.items.find((i) => i.product.toString() === req.params.productId);
    if (!item) return res.status(404).json({ message: 'Item not in cart' });
    if (quantity <= 0) cart.items = cart.items.filter((i) => i.product.toString() !== req.params.productId);
    else item.quantity = quantity;
    await cart.save();
    res.json(cart);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
};

export const removeFromCart = async (req: AuthRequest, res: Response) => {
  try {
    const cart = await Cart.findOne({ user: req.user!.userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    cart.items = cart.items.filter((i) => i.product.toString() !== req.params.productId);
    await cart.save();
    res.json(cart);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
};

export const clearCart = async (req: AuthRequest, res: Response) => {
  try {
    await Cart.findOneAndUpdate({ user: req.user!.userId }, { items: [], totalAmount: 0 });
    res.json({ message: 'Cart cleared' });
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
};
