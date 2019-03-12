import { model, Schema } from 'mongoose';
import { Snapshot } from '../snapshot/snapshot.model';
import { IArticle } from './article.interface';

const ArticleSchema: Schema<IArticle> = new Schema({
  currency_id: String,
  id: { type: String, unique: true, required: true },
  title: String,
  status: String,
  permalink: String,
  thumbnail: String,
  images: [String],
  price: Number,
  history: [Snapshot.schema],
});

export const Article = model<IArticle>('Article', ArticleSchema);
