const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Snapshot = require('./snapshot.model')

const ArticleSchema = new Schema({
  currency_id: String,
  id: { type: String, unique: true, required: true },
  title: String,
  status: String,
  permalink: String,
  thumbnail: String,
  original_price: Number,
  images: { type: [String], default: [] },
  history: [Snapshot.schema]
})

ArticleSchema.methods.getLastPrice = function () {
  const lastSnapshot = this.history[this.history.length - 1]
  return lastSnapshot && lastSnapshot.price
}

ArticleSchema.methods.shouldUpdate = function (price, images) {
  return this.getLastPrice() !== price || this.images.toObject() !== images
}

module.exports = mongoose.model('Article', ArticleSchema)
