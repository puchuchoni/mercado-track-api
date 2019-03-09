import { model, Schema } from 'mongoose';
import { format } from 'date-fns';
import { ISnapshot } from './snapshot.interface';

const SnapshotSchema: Schema<ISnapshot> = new Schema(
  {
    original_price: Number,
    price: Number,
    discount: Number,
    date: {
      type: String,
      default: () => format(new Date(), 'DD/MM/YYYY'),
    },
  },
  {
    _id: false,
  },
);

export const Snapshot = model<ISnapshot>('Snapshot', SnapshotSchema);
