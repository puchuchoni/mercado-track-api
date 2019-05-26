import { Document } from 'mongoose';
import { ISnapshot } from '../snapshot/snapshot.interface';

export interface IArticle extends Document {
  currency_id: string;
  id: string;
  seller_id: number;
  title: string;
  status: string;
  price: number;
  permalink: string;
  thumbnail: string;
  images: string[];
  category_id: string;
  tags: string[];
  history: ISnapshot[];
}
