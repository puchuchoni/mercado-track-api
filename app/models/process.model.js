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
  endDate: Date,
  processedHours: Number
})

module.exports = mongoose.model('ProcessRecord', ProcessSchema)
