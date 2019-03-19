import { Document } from 'mongoose';

export interface ICategoryLean {
  _id: string;
  name: string;
}

export interface ICategory extends Document, ICategoryLean {
  _id: string;
  name: string;
  parent?: string;
}
