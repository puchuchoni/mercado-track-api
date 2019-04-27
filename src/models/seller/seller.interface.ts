import { Document } from 'mongoose';

export interface ISeller extends Document {
  id: number;
  nickname: string;
  /* TODO: add things to track ourselves */
}
