import { Request, Response } from 'express';
import { Product } from '../models/Product.model';
import { AuthRequest } from '../middleware/auth.middleware';
import axios from "axios";

// ================== AI RECOMMENDATIONS ==================
export const getAIRecommendations = async (req: Request, res: Response) => {
  try {
    const response = await axios.post("http://127.0.0.1:8000/recommend", {
      category: req.body.category,
      budget: req.body.budget,
    });

    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "AI service error" });
  }
};

// ================== DATABASE RECOMMENDATIONS ==================
export const getDBRecommendations = async (req: AuthRequest, res: Response) => {
  try {
    const { occasion, budget } = req.query;

    const filter: any = { isActive: true };

    if (occasion) filter.occasion = { $in: [occasion] };
    if (budget) filter.price = { $lte: Number(budget) };

    const recommendations = await Product.find(filter)
      .sort({ rating: -1 })
      .limit(8)
      .select('name price images rating occasion');

    res.json({ recommendations, personalized: false });

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ================== STATIC GIFT MESSAGES ==================
const GIFT_MESSAGES: Record<string, string[]> = {
  birthday: [
    'Wishing you a birthday filled with all the magic the world has to offer! 🎂',
    'May this birthday be the start of the most wonderful chapter of your life! 🎉',
    'Another year of your amazing story! Wishing you joy and laughter always! 🎁',
  ],
  anniversary: [
    'Two hearts, one story — and it just keeps getting more beautiful! 💕',
    'Your love story is our favourite. Happy anniversary! 💍',
    'Every year together is a gift. Here\'s to forever! 🥂',
  ],
  festive: [
    'May the festival of lights fill your home with joy and prosperity! 🪔',
    'Wishing you and your family a blessed and joyful celebration! ✨',
    'May this festive season bring you endless happiness! 🎆',
  ],
  wedding: [
    'As you begin this beautiful journey together, may your love grow deeper every day! 💒',
    'Two souls, one beautiful life. Congratulations! 🌹',
    'Wishing you a lifetime of love, laughter and happiness together! 💞',
  ],
};

// ================== CHAT BOT ==================
const BOT_REPLIES = [
  'Great choice! For birthdays I recommend our Birthday Hamper Deluxe (₹1,840) — a bestseller! 🎂',
  'For anniversaries, the Crystal Set (₹3,200) or Memory Scrapbook Kit (₹1,100) are perfect! 💍',
  'I found some amazing festive gifts under ₹2,000! The Diwali Premium Box is trending right now 🪔',
  'You can apply coupon GIFT20 for ₹200 off or DIWALI for ₹500 off your order! 🎁',
  'Our top rated gifts this week: Spa & Wellness Kit and the Luxury Candle Collection! ✨',
];

let botIndex = 0;

export const chat = async (req: Request, res: Response) => {
  try {
    if (process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.includes('your-key')) {
      const OpenAI = require('openai');
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

      const { messages } = req.body;

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are Gifty, a helpful AI assistant for Giftura gift shop. Help users find perfect gifts. Be warm and concise.'
          },
          ...messages,
        ],
        max_tokens: 300,
      });

      return res.json({
        reply: completion.choices[0].message.content,
        suggestedProducts: []
      });
    }

    const reply = BOT_REPLIES[botIndex % BOT_REPLIES.length];
    botIndex++;

    res.json({ reply, suggestedProducts: [] });

  } catch (err) {
    res.json({
      reply: 'Let me help you find the perfect gift! What occasion are you shopping for? 🎁',
      suggestedProducts: []
    });
  }
};

// ================== GIFT MESSAGE GENERATOR ==================
export const generateGiftMessage = async (req: Request, res: Response) => {
  try {
    const { occasion = 'birthday' } = req.body;

    if (process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.includes('your-key')) {
      const OpenAI = require('openai');
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: `Write a short heartfelt gift message for a ${occasion}. Under 60 words.`
          }
        ],
        max_tokens: 120,
      });

      return res.json({
        message: completion.choices[0].message.content
      });
    }

    const msgs = GIFT_MESSAGES[occasion.toLowerCase()] || GIFT_MESSAGES.birthday;

    res.json({
      message: msgs[Math.floor(Math.random() * msgs.length)]
    });

  } catch (err) {
    res.json({
      message: 'Wishing you all the joy and happiness in the world! 🎁'
    });
  }
};