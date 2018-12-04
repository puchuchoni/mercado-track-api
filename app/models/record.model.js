const mongoose = require('mongoose')
const constants = require('../utils/constants')
const Schema = mongoose.Schema

const RecordSchema = new Schema({
  name: String,
  status: String,
  itemsProcessed: Number,
  startDate: {
    type: Date,
    default: new Date()
  },
  endDate: Date,
  processedHours: Number
})

RecordSchema.methods.start = function () {
  this.status = constants.processStatus.running
  this.start = new Date()
  return this.save()
}

RecordSchema.methods.stop = function (proccesedElements) {
  this.endDate = new Date()
  this.status = constants.processStatus.finished
  this.itemsProcessed = proccesedElements
  const dateDiff = this.endDate - this.startDate
  this.processedHours = Math.floor((dateDiff % 86400000) / 3600000)
  return this.save()
}

module.exports = mongoose.model('Record', RecordSchema)
