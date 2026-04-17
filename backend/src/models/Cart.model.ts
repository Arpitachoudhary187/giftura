import mongoose, { Schema, Document } from 'mongoose';

export interface ICart extends Document {
  user: mongoose.Types.ObjectId;
  items: { product: mongoose.Types.ObjectId; quantity: number; price: number }[];
  totalAmount: number;
}

const CartSchema = new Schema<ICart>(
  {
    user:  { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: [{
      product:  { type: Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, default: 1, min: 1 },
      price:    { type: Number, required: true },
    }],
    totalAmount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

CartSchema.pre('save', function (next) {
  this.totalAmount = this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  next();
});

export const Cart = mongoose.model<ICart>('Cart', CartSchema);
