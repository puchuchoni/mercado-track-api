const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ProcessSchema = new Schema({
  id: { type: String, unique: true, required: true },
  name: String,
  status: String,
  itemsProcessed: Number,
  startDate: Date,
  endDate: Date
})

ProcessSchema.methods.getLastPrice = function () {
  const lastSnapshot = this.history[this.history.length - 1]
  return lastSnapshot && lastSnapshot.price
}

module.exports = mongoose.model('Article', ArticleSchema)