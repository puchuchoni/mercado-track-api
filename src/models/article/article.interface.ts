import { Document } from 'mongoose';
import { ISnapshot } from '../snapshot/snapshot.interface';

export interface IArticle extends Document {
  currency_id: string;
  id: { type: string, unique: true, required: true };
  title: string;
  status: string;
  permalink: string;
  thumbnail: string;
  images: { type: [string], default: [] };
  history: [ISnapshot];
  getLastPrice(): number;
  getLastSnapshot(): ISnapshot;
  shouldUpdate(IMLArticle, []): boolean;
  shouldCreate(): boolean;
  updateOne(article: any, callback: any);
}
