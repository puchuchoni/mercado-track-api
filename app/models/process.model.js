const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ProcessSchema = new Schema({
  name: String,
  status: String,
  itemsProcessed: Number,
  startDate: {
    type: Date,
    default: new Date()
  },
  endDate: Date
})

ProcessSchema.methods.getLastPrice = function () {
  const lastSnapshot = this.history[this.history.length - 1]
  return lastSnapshot && lastSnapshot.price
}

module.exports = mongoose.model('ProcessRecord', ProcessSchema)