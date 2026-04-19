import { Request, Response } from 'express';
import { Product } from '../models/Product.model';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { category, occasion, minPrice, maxPrice, search, sort, page = 1, limit = 12 } = req.query;
    
    const filter: any = { isActive: true };
    
    if (category) filter.category = category;
    if (occasion) filter.occasion = { $in: [occasion] };
    if (search) filter.name = { $regex: search, $options: 'i' };
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const sortMap: any = {
      price_asc:  { price: 1 },
      price_desc: { price: -1 },
      rating:     { rating: -1 },
      newest:     { createdAt: -1 },
    };
    const sortQuery = sortMap[sort as string] || { createdAt: -1 };

    const skip = (Number(page) - 1) * Number(limit);

    const products = await Product.find(filter)
      .sort(sortQuery)
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const total = await Product.countDocuments(filter);

    res.json({ products, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err: any) {
    console.error('getProducts error:', err.message);
    res.status(500).json({ message: err.message });
  }
};

export const getProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id).lean();
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ message: 'Product removed' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getFeatured = async (_req: Request, res: Response) => {
  try {
    const products = await Product.find({ isFeatured: true, isActive: true }).lean();
    res.json(products);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};