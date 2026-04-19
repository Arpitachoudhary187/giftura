import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  occasion: string[];
  tags: string[];
  stock: number;
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isActive: boolean;
}

const ProductSchema = new Schema<IProduct>(
  {
    name:          { type: String, required: true, trim: true },
    description:   { type: String, required: true },
    price:         { type: Number, required: true },
    originalPrice: { type: Number },
    images:        [{ type: String }],
    category:      { type: String, required: true },
    occasion:      [{ type: String }],
    tags:          [{ type: String }],
    stock:         { type: Number, default: 0 },
    rating:        { type: Number, default: 0, min: 0, max: 5 },
    reviewCount:   { type: Number, default: 0 },
    isFeatured:    { type: Boolean, default: false },
    isActive:      { type: Boolean, default: true },
  },
  { timestamps: true }
);


export const Product = mongoose.model<IProduct>('Product', ProductSchema);
