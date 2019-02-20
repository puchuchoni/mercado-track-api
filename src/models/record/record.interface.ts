import { Document } from 'mongoose';

export interface IRecord extends Document {
  name: string;
  status: string;
  itemsProcessed: number;
  startDate: Date;
  endDate: Date;
  processedHours: number;
  start();
  stop(proccesedElements: number);
}
