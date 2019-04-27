import { model, Schema } from 'mongoose';
import { ISeller } from './seller.interface';

const SellerSchema: Schema<ISeller> = new Schema({
  id: { type: Number, unique: true, required: true },
  nickname: String,
  /* TODO: add things to track ourselves */
});

export const Seller = model<ISeller>('Seller', SellerSchema);
