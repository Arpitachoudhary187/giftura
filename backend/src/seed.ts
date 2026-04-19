import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

import bcrypt from 'bcryptjs';
import { Product } from './models/Product.model';
import { User } from './models/User.model';

dotenv.config({ path: require('path').resolve(__dirname, '../../.env') });

const products = [
  // ─── BIRTHDAY ───────────────────────────────────────────────
  {
    name: 'Birthday Hamper Deluxe',
    description: 'A luxurious birthday hamper packed with assorted Belgian chocolates, scented soy candles, a silk ribbon bow, and a handwritten greeting card. Perfect for making someone feel truly special.',
    price: 1840,
    originalPrice: 2200,
    images: ['https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400'],
    category: 'Hampers',
    occasion: ['birthday'],
    tags: ['hamper', 'birthday', 'luxury', 'chocolate', 'candle'],
    stock: 50,
    rating: 4.8,
    reviewCount: 124,
    isFeatured: true,
  },
  {
    name: 'Personalised Star Map',
    description: 'A stunning custom star map showing exactly how the night sky looked on any special date — a birthday, anniversary, or first meeting. Printed on premium matte paper and framed.',
    price: 1299,
    originalPrice: 1599,
    images: ['https://images.unsplash.com/photo-1464802686167-b939a6910659?w=400'],
    category: 'Personalised',
    occasion: ['birthday', 'anniversary'],
    tags: ['star map', 'personalised', 'custom', 'night sky', 'framed'],
    stock: 35,
    rating: 4.9,
    reviewCount: 88,
    isFeatured: true,
  },
  {
    name: 'Gourmet Cupcake Tower',
    description: 'A beautiful tower of 12 handcrafted gourmet cupcakes in assorted flavours — red velvet, blueberry, lemon zest, and dark chocolate. Delivered fresh on the day.',
    price: 850,
    images: ['https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=400'],
    category: 'Food & Sweets',
    occasion: ['birthday'],
    tags: ['cupcake', 'bakery', 'birthday', 'sweet', 'fresh'],
    stock: 30,
    rating: 4.7,
    reviewCount: 211,
  },
  {
    name: 'Personalised Mug & Keychain Set',
    description: 'A custom printed ceramic mug featuring a personal photo or message, paired with a laser-engraved metal keychain. A charming and practical gift.',
    price: 599,
    images: ['https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400'],
    category: 'Personalised',
    occasion: ['birthday'],
    tags: ['mug', 'keychain', 'personalised', 'custom', 'photo'],
    stock: 150,
    rating: 4.3,
    reviewCount: 330,
  },
  {
    name: 'Spa & Self-Care Gift Set',
    description: 'Treat someone to ultimate relaxation with this premium spa set — Himalayan bath salts, lavender essential oil, a jade face roller, rose petal face mask, and a wooden bath tray.',
    price: 2100,
    originalPrice: 2500,
    images: ['https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400'],
    category: 'Wellness',
    occasion: ['birthday', 'anniversary', 'wedding'],
    tags: ['spa', 'wellness', 'bath', 'relax', 'self-care', 'lavender'],
    stock: 45,
    rating: 4.7,
    reviewCount: 118,
    isFeatured: true,
  },
  {
    name: 'LED Neon Name Sign',
    description: 'A vibrant custom LED neon sign with any name or short message. Perfect bedroom or party décor. Available in 10 colours. USB powered with dimmer switch.',
    price: 1750,
    originalPrice: 2100,
    images: ['https://images.unsplash.com/photo-1545128485-c400e7702796?w=400'],
    category: 'Home Decor',
    occasion: ['birthday'],
    tags: ['neon', 'LED', 'custom', 'name sign', 'decor', 'light'],
    stock: 40,
    rating: 4.6,
    reviewCount: 95,
  },
  {
    name: 'Polaroid Photo Album Kit',
    description: 'A beautiful linen-covered photo album with 50 polaroid-style printed photos of your choice. Includes gold star stickers and a handwritten caption pen.',
    price: 1450,
    images: ['https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400'],
    category: 'Personalised',
    occasion: ['birthday', 'anniversary'],
    tags: ['photo', 'album', 'polaroid', 'memories', 'personalised'],
    stock: 60,
    rating: 4.8,
    reviewCount: 145,
  },

  // ─── ANNIVERSARY ────────────────────────────────────────────
  {
    name: 'Anniversary Crystal Set',
    description: 'Stunning hand-cut crystal wine glass pair with a heart motif engraving — a timeless and elegant gift for couples celebrating any anniversary.',
    price: 3200,
    originalPrice: 3800,
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'],
    category: 'Home Decor',
    occasion: ['anniversary'],
    tags: ['crystal', 'couple', 'anniversary', 'premium', 'wine glass'],
    stock: 20,
    rating: 4.9,
    reviewCount: 87,
    isFeatured: true,
  },
  {
    name: 'Memory Scrapbook Kit',
    description: 'Create a beautiful memory book with premium kraft papers, washi tapes, photo corners, rose gold stickers, and embellishments. A deeply personal and heartfelt gift.',
    price: 1100,
    originalPrice: 1350,
    images: ['https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400'],
    category: 'Personalised',
    occasion: ['anniversary', 'birthday'],
    tags: ['scrapbook', 'memory', 'personalised', 'DIY', 'photo book'],
    stock: 40,
    rating: 4.8,
    reviewCount: 62,
  },
  {
    name: 'Couple Infinity Bracelet Set',
    description: 'A matching pair of sterling silver infinity bracelets with each partner\'s initials engraved. Comes in a premium velvet box with a love letter card.',
    price: 1899,
    images: ['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400'],
    category: 'Jewellery',
    occasion: ['anniversary', 'wedding'],
    tags: ['bracelet', 'couple', 'silver', 'infinity', 'jewellery', 'matching'],
    stock: 55,
    rating: 4.7,
    reviewCount: 103,
    isFeatured: true,
  },
  {
    name: 'Romantic Candle Light Dinner Kit',
    description: 'Everything you need for a perfect romantic dinner at home — 2 long dinner candles, rose petals, a bottle of sparkling wine, gourmet chocolates, and a "reasons I love you" card.',
    price: 2450,
    images: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400'],
    category: 'Experiences',
    occasion: ['anniversary'],
    tags: ['romantic', 'candle', 'dinner', 'rose', 'wine', 'couple'],
    stock: 25,
    rating: 4.9,
    reviewCount: 76,
  },
  {
    name: 'Personalised Cushion Cover',
    description: 'A soft velvet cushion cover with a custom photo print or couple illustration. Available in blush pink, navy, and ivory. Includes cushion insert.',
    price: 799,
    images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400'],
    category: 'Home Decor',
    occasion: ['anniversary', 'wedding'],
    tags: ['cushion', 'personalised', 'photo', 'couple', 'home decor'],
    stock: 80,
    rating: 4.4,
    reviewCount: 192,
  },

  // ─── FESTIVE / DIWALI ────────────────────────────────────────
  {
    name: 'Diwali Premium Gift Box',
    description: 'Celebrate the festival of lights with this beautifully curated Diwali box — assorted dry fruits, artisanal mithai, hand-painted diyas, incense sticks, and a premium greeting card.',
    price: 2550,
    images: ['https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=400'],
    category: 'Festive',
    occasion: ['festive'],
    tags: ['diwali', 'festive', 'dry fruits', 'traditional', 'mithai', 'diya'],
    stock: 100,
    rating: 4.7,
    reviewCount: 203,
    isFeatured: true,
  },
  {
    name: 'Brass Diya & Pooja Thali Set',
    description: 'An intricately designed brass pooja thali set with 5 diyas, a bell, incense holder, and kumkum box. Packaged in a beautiful red velvet box — perfect for gifting.',
    price: 1350,
    images: ['https://images.unsplash.com/photo-1604423043492-41ef86d3e81b?w=400'],
    category: 'Festive',
    occasion: ['festive'],
    tags: ['brass', 'diya', 'pooja', 'traditional', 'festive', 'diwali'],
    stock: 60,
    rating: 4.6,
    reviewCount: 87,
  },
  {
    name: 'Artisanal Mithai Box',
    description: 'A premium selection of 16 handcrafted Indian sweets — kaju katli, motichoor ladoo, pista barfi, and gulkand pedha. Made fresh with no preservatives.',
    price: 750,
    images: ['https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400'],
    category: 'Food & Sweets',
    occasion: ['festive', 'birthday'],
    tags: ['mithai', 'sweets', 'indian', 'kaju katli', 'festive', 'diwali'],
    stock: 200,
    rating: 4.8,
    reviewCount: 315,
  },
  {
    name: 'Rakhi Special Gift Box',
    description: 'A beautiful Rakhi set featuring a designer zardozi rakhi, a box of assorted chocolates, dry fruits, and a heartfelt greeting card for your beloved brother.',
    price: 650,
    images: ['https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400'],
    category: 'Festive',
    occasion: ['festive'],
    tags: ['rakhi', 'festival', 'brother', 'sister', 'traditional', 'chocolate'],
    stock: 200,
    rating: 4.5,
    reviewCount: 289,
  },
  {
    name: 'Handpainted Madhubani Art Frame',
    description: 'A stunning hand-painted Madhubani art piece on canvas — each one unique and created by traditional Bihar artisans. Available in three sizes. Framed and ready to hang.',
    price: 1800,
    images: ['https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400'],
    category: 'Art & Craft',
    occasion: ['festive', 'wedding'],
    tags: ['madhubani', 'art', 'handpainted', 'traditional', 'frame', 'artisan'],
    stock: 15,
    rating: 4.9,
    reviewCount: 42,
    isFeatured: true,
  },

  // ─── WEDDING ────────────────────────────────────────────────
  {
    name: 'Wedding Gift Hamper Luxury',
    description: 'A grand wedding hamper with a crystal photo frame, scented candle set, premium chocolates, personalised message card, and a champagne bottle — elegantly packaged in a gold box.',
    price: 4200,
    originalPrice: 5000,
    images: ['https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400'],
    category: 'Hampers',
    occasion: ['wedding'],
    tags: ['wedding', 'luxury', 'hamper', 'champagne', 'crystal', 'premium'],
    stock: 20,
    rating: 4.9,
    reviewCount: 54,
    isFeatured: true,
  },
  {
    name: 'Silk Saree Gift Box',
    description: 'A handwoven Banarasi silk saree with zari border — packaged in a premium gift box with a blouse piece and a handwritten note. A timeless and cherished gift.',
    price: 4500,
    images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400'],
    category: 'Fashion',
    occasion: ['festive', 'wedding', 'birthday'],
    tags: ['saree', 'silk', 'banarasi', 'traditional', 'premium', 'zari'],
    stock: 25,
    rating: 4.9,
    reviewCount: 45,
  },
  {
    name: 'Luxury Candle Collection',
    description: 'A set of 4 hand-poured soy wax candles in rose gold jars — fragrances include rose & oud, jasmine & sandalwood, vanilla & amber, and cedarwood & musk.',
    price: 1450,
    images: ['https://images.unsplash.com/photo-1603905999320-21acf41f84d1?w=400'],
    category: 'Home Decor',
    occasion: ['birthday', 'wedding', 'anniversary'],
    tags: ['candle', 'luxury', 'soy', 'fragrance', 'rose gold', 'oud'],
    stock: 60,
    rating: 4.6,
    reviewCount: 98,
    isFeatured: true,
  },

  // ─── GENERAL / ANY OCCASION ──────────────────────────────────
  {
    name: 'Belgian Chocolate Hamper',
    description: 'An indulgent selection of imported Belgian chocolates — dark, milk, and white — in a beautiful keepsake wooden box. Perfect for chocolate lovers.',
    price: 980,
    images: ['https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=400'],
    category: 'Food & Sweets',
    occasion: ['birthday', 'festive', 'wedding', 'anniversary'],
    tags: ['chocolate', 'belgian', 'hamper', 'sweet', 'imported', 'premium'],
    stock: 80,
    rating: 4.4,
    reviewCount: 211,
  },
  {
    name: 'Custom Photo Frame Set',
    description: 'Set of 3 elegant natural wood frames in 4x6, 5x7, and 8x10 sizes — customizable with your favourite photos. Comes with a personalised engraved message on the largest frame.',
    price: 890,
    originalPrice: 1100,
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'],
    category: 'Personalised',
    occasion: ['birthday', 'anniversary', 'wedding'],
    tags: ['photo', 'frame', 'personalised', 'wooden', 'custom', 'engraved'],
    stock: 75,
    rating: 4.5,
    reviewCount: 156,
  },
  {
    name: 'Garden Herb Grow Kit',
    description: 'Grow your own herb garden with this beautiful kit — includes 5 terracotta pots, organic soil, seeds for basil, mint, coriander, lavender, and rosemary, plus a watering can.',
    price: 750,
    images: ['https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=400'],
    category: 'Lifestyle',
    occasion: ['birthday'],
    tags: ['plant', 'garden', 'herb', 'green', 'eco', 'organic', 'grow kit'],
    stock: 35,
    rating: 4.6,
    reviewCount: 72,
  },
  {
    name: 'Premium Leather Wallet',
    description: 'A slim genuine leather bifold wallet with RFID blocking technology. Available in tan, black, and navy. Can be monogrammed with initials on the inside.',
    price: 1200,
    images: ['https://images.unsplash.com/photo-1627123424574-724758594785?w=400'],
    category: 'Fashion',
    occasion: ['birthday', 'anniversary'],
    tags: ['wallet', 'leather', 'premium', 'RFID', 'monogram', 'men'],
    stock: 50,
    rating: 4.5,
    reviewCount: 134,
  },
  {
    name: 'Succulent Plant Trio',
    description: 'Three adorable hand-picked succulents in hand-painted ceramic pots — each one is unique and comes with a personalised care card and a ribbon bow.',
    price: 550,
    images: ['https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400'],
    category: 'Lifestyle',
    occasion: ['birthday', 'anniversary'],
    tags: ['succulent', 'plant', 'ceramic', 'green', 'eco', 'minimal'],
    stock: 65,
    rating: 4.4,
    reviewCount: 198,
  },
  {
    name: 'Artisan Coffee Gift Set',
    description: 'For the coffee lover — a curated set of 3 single-origin whole bean coffees from Coorg, Chikmagalur, and Araku Valley. Includes a hand-painted mug and a French press.',
    price: 1650,
    images: ['https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400'],
    category: 'Food & Sweets',
    occasion: ['birthday', 'anniversary'],
    tags: ['coffee', 'artisan', 'single origin', 'mug', 'french press', 'coorg'],
    stock: 40,
    rating: 4.8,
    reviewCount: 87,
    isFeatured: true,
  },
  {
    name: 'Book Lovers Gift Box',
    description: 'A curated gift box for book lovers — includes a leather bookmark, a scented candle, a cosy pair of socks, and a handpicked bestseller novel. Wrapped in kraft paper.',
    price: 1300,
    images: ['https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400'],
    category: 'Lifestyle',
    occasion: ['birthday'],
    tags: ['book', 'reading', 'novel', 'bookmark', 'candle', 'cosy'],
    stock: 30,
    rating: 4.7,
    reviewCount: 63,
  },
  {
    name: 'Fitness & Wellness Kit',
    description: 'The perfect gift for a fitness enthusiast — includes a resistance band set, a shaker bottle, a foam roller, protein bar samples, and a motivational journal.',
    price: 1900,
    images: ['https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400'],
    category: 'Wellness',
    occasion: ['birthday'],
    tags: ['fitness', 'gym', 'wellness', 'resistance band', 'protein', 'health'],
    stock: 25,
    rating: 4.5,
    reviewCount: 49,
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect('');
    console.log('✅ Connected to MongoDB');

    await Product.deleteMany({});
    await User.deleteMany({});
    console.log('🗑️  Cleared existing data');

    await Product.insertMany(products);
    console.log(`✅ Seeded ${products.length} products successfully!`);

    const adminPass = await bcrypt.hash('admin123', 12);
    const userPass  = await bcrypt.hash('user123', 12);

    await User.create({ name: 'Admin User', email: 'admin@giftura.com', password: adminPass, role: 'admin' });
    await User.create({ name: 'Test User',  email: 'user@giftura.com',  password: userPass,  role: 'user' });

    console.log('\n👤 Test accounts created:');
    console.log('   Admin → admin@giftura.com / admin123');
    console.log('   User  → user@giftura.com  / user123');
    console.log('\n🛍️  Product categories seeded:');
    console.log('   🎂 Birthday     — 7 products');
    console.log('   💍 Anniversary  — 5 products');
    console.log('   🪔 Festive      — 5 products');
    console.log('   💒 Wedding      — 3 products');
    console.log('   🎁 General      — 8 products');
    console.log('\n🎉 Database seeded successfully! Run npm run dev to start.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  }
};

seedDB();