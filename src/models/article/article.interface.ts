import { Document } from 'mongoose';
import { ISnapshot } from '../snapshot/snapshot.interface';

export interface IArticle extends Document {
  currency_id: string;
  id: string;
  title: string;
  status: string;
  price: number;
  permalink: string;
  thumbnail: string;
  images: string[];
  history: ISnapshot[];
}
