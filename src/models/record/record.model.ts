import { Schema, model } from 'mongoose';
import { ProcessStatuses } from './record.constants';
import { IRecord } from './record.interface';
import { datesHoursDiff } from '../../shared/utils';

const RecordSchema: Schema<IRecord> = new Schema({
  name: String,
  status: String,
  itemsProcessed: Number,
  startDate: {
    type: Date,
    default: new Date(),
  },
  endDate: Date,
  processedHours: Number,
});

RecordSchema.methods.start = function () {
  this.status = ProcessStatuses.Running;
  this.startDate = new Date();
  return this.save();
};

RecordSchema.methods.stop = function (proccesedElements: number) {
  this.endDate = new Date();
  this.status = ProcessStatuses.Finished;
  this.itemsProcessed = proccesedElements;
  this.processedHours = datesHoursDiff(this.endDate, this.startDate);
  return this.save();
};

const Record = model('Record', RecordSchema);

export { Record };
