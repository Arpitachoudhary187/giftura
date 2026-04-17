import { Router } from 'express';
import { protect } from '../middleware/auth.middleware';
import { User } from '../models/User.model';

const router = Router();
router.use(protect);

router.get('/', async (req: any, res) => {
  try {
    const user = await User.findById(req.user.userId).populate('wishlist');
    res.json(user?.wishlist || []);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/toggle/:productId', async (req: any, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const pid = req.params.productId;
    const idx = user.wishlist.findIndex((id) => id.toString() === pid);
    if (idx > -1) user.wishlist.splice(idx, 1);
    else user.wishlist.push(pid as any);
    await user.save();
    res.json({ wishlisted: idx === -1, wishlist: user.wishlist });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
