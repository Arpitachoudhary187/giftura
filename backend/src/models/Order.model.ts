import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  items: { product: mongoose.Types.ObjectId; name: string; price: number; quantity: number; image: string }[];
  totalAmount: number;
  discount: number;
  couponCode?: string;
  shippingAddress: { name: string; phone: string; address: string; city: string; pincode: string; state: string };
  paymentMethod: string;
  paymentId?: string;
  razorpayOrderId?: string;
  currentStatus: string;
  trackingHistory: { status: string; message: string; timestamp: Date; location?: string }[];
  giftMessage?: string;
}

const OrderSchema = new Schema<IOrder>(
  {
    user:  { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{
      product:  { type: Schema.Types.ObjectId, ref: 'Product' },
      name:     String, price: Number, quantity: Number, image: String,
    }],
    totalAmount:  { type: Number, required: true },
    discount:     { type: Number, default: 0 },
    couponCode:   { type: String },
    shippingAddress: { name: String, phone: String, address: String, city: String, pincode: String, state: String },
    paymentMethod:   { type: String, default: 'razorpay' },
    paymentId:       { type: String },
    razorpayOrderId: { type: String },
    currentStatus:   { type: String, default: 'placed' },
    trackingHistory: [{ status: String, message: String, timestamp: { type: Date, default: Date.now }, location: String }],
    giftMessage:     { type: String },
  },
  { timestamps: true }
);

export const Order = mongoose.model<IOrder>('Order', OrderSchema);
