import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { Product } from './models/Product.model';
import { User } from './models/User.model';

dotenv.config();

const products = [
  { name: 'Birthday Hamper Deluxe', description: 'A luxurious birthday hamper with assorted chocolates, scented candles, and a personalised card.', price: 1840, originalPrice: 2200, images: [], category: 'Hampers', occasion: ['birthday'], tags: ['hamper', 'birthday', 'luxury', 'chocolate'], stock: 50, rating: 4.8, reviewCount: 124, isFeatured: true },
  { name: 'Anniversary Crystal Set', description: 'Stunning hand-cut crystal pair — a timeless gift for couples celebrating their anniversary.', price: 3200, originalPrice: 3800, images: [], category: 'Home Decor', occasion: ['anniversary'], tags: ['crystal', 'couple', 'anniversary', 'premium'], stock: 20, rating: 4.9, reviewCount: 87, isFeatured: true },
  { name: 'Diwali Premium Gift Box', description: 'Celebrate the festival of lights with this premium Diwali box — dry fruits, mithai and diyas.', price: 2550, images: [], category: 'Festive', occasion: ['festive'], tags: ['diwali', 'festive', 'dry fruits', 'traditional'], stock: 100, rating: 4.7, reviewCount: 203, isFeatured: true },
  { name: 'Custom Photo Frame Set', description: 'Set of 3 elegant wooden frames — customizable with your favourite photos and messages.', price: 890, originalPrice: 1100, images: [], category: 'Personalised', occasion: ['birthday', 'anniversary', 'wedding'], tags: ['photo', 'frame', 'personalised', 'wooden'], stock: 75, rating: 4.5, reviewCount: 156 },
  { name: 'Luxury Candle Collection', description: 'A set of 4 premium soy wax candles in rose, jasmine, sandalwood and vanilla.', price: 1450, images: [], category: 'Home Decor', occasion: ['birthday', 'wedding', 'anniversary'], tags: ['candle', 'luxury', 'soy', 'fragrance'], stock: 60, rating: 4.6, reviewCount: 98, isFeatured: true },
  { name: 'Belgian Chocolate Hamper', description: 'Imported Belgian chocolates in a beautiful keepsake box — perfect for any occasion.', price: 980, images: [], category: 'Food & Sweets', occasion: ['birthday', 'festive', 'wedding'], tags: ['chocolate', 'belgian', 'hamper', 'sweet'], stock: 80, rating: 4.4, reviewCount: 211 },
  { name: 'Memory Scrapbook Kit', description: 'Create a beautiful memory book with premium papers, stickers, and embellishments.', price: 1100, originalPrice: 1350, images: [], category: 'Personalised', occasion: ['anniversary', 'birthday'], tags: ['scrapbook', 'memory', 'personalised', 'DIY'], stock: 40, rating: 4.8, reviewCount: 62 },
  { name: 'Spa & Wellness Kit', description: 'Premium bath salts, essential oils, face mask, and a wooden bath tray.', price: 2100, originalPrice: 2500, images: [], category: 'Wellness', occasion: ['birthday', 'anniversary', 'wedding'], tags: ['spa', 'wellness', 'bath', 'relax', 'self-care'], stock: 45, rating: 4.7, reviewCount: 118, isFeatured: true },
  { name: 'Personalised Mug & Keychain', description: 'A custom printed ceramic mug paired with a laser-engraved keychain.', price: 599, images: [], category: 'Personalised', occasion: ['birthday'], tags: ['mug', 'keychain', 'personalised', 'custom'], stock: 150, rating: 4.3, reviewCount: 330 },
  { name: 'Garden Herb Kit', description: 'Grow your own herb garden — comes with 5 pots, soil, seeds and a watering can.', price: 750, images: [], category: 'Lifestyle', occasion: ['birthday'], tags: ['plant', 'garden', 'herb', 'green', 'eco'], stock: 35, rating: 4.6, reviewCount: 72 },
  { name: 'Silk Saree Gift Box', description: 'Handwoven silk saree with zari work, packaged in a premium gift box.', price: 4500, images: [], category: 'Fashion', occasion: ['festive', 'wedding', 'birthday'], tags: ['saree', 'silk', 'traditional', 'premium'], stock: 25, rating: 4.9, reviewCount: 45, isFeatured: true },
  { name: 'Rakhi Special Gift Box', description: 'A beautiful Rakhi set with designer rakhi, sweets, and a heartfelt greeting card.', price: 650, images: [], category: 'Festive', occasion: ['festive'], tags: ['rakhi', 'festival', 'brother', 'sister'], stock: 200, rating: 4.5, reviewCount: 289 },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('✅ Connected to MongoDB');
    await Product.deleteMany({});
    await User.deleteMany({});
    console.log('🗑️  Cleared existing data');
    await Product.insertMany(products);
    console.log(`✅ Seeded ${products.length} products`);
    const adminPass = await bcrypt.hash('admin123', 12);
    const userPass = await bcrypt.hash('user123', 12);
    await User.create({ name: 'Admin User', email: 'admin@giftura.com', password: adminPass, role: 'admin' });
    await User.create({ name: 'Test User', email: 'user@giftura.com', password: userPass, role: 'user' });
    console.log('✅ Created users:');
    console.log('   Admin  → admin@giftura.com / admin123');
    console.log('   User   → user@giftura.com  / user123');
    console.log('\n🎉 Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  }
};

seedDB();
