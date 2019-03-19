import { model, Schema } from 'mongoose';
import { ICategory } from './category.interface';

const CategorySchema: Schema<ICategory> = new Schema(
  {
    _id: String,
    name: String,
    parent: String,
  },
);

export const Category = model<ICategory>('Category', CategorySchema);
