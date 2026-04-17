import { Router } from 'express';

import {
  chat,
  generateGiftMessage,
  getAIRecommendations,
  getDBRecommendations
} from '../controllers/ai.controller';

import { protect } from '../middleware/auth.middleware';

const router = Router();

// ================== AI CHAT ==================
router.post('/chat', chat);

// ================== GIFT MESSAGE ==================
router.post('/gift-message', generateGiftMessage);

// ================== AI RECOMMENDATIONS (FastAPI) ==================
router.post('/recommend', getAIRecommendations);

// ================== DB RECOMMENDATIONS (MongoDB) ==================
router.get('/recommendations', protect, getDBRecommendations);

export default router;