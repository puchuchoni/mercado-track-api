const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Snapshot = require('./snapshot.model')

const ArticleSchema = new Schema({
  currency_id: String,
  id: String,
  title: String,
  status: String,
  permalink: String,
  thumbnail: String,
  history: [ Snapshot.schema ]
})

ArticleSchema.methods.getLastPrice = function () {
  const lastSnapshot = this.history[this.history.length - 1]
  return lastSnapshot && lastSnapshot.price
}

ArticleSchema.methods.updatePrice = function (price) {
  this.history.push(new Snapshot({
    price: price,
    date: new Date()
  }))
}

module.exports = mongoose.model('Article', ArticleSchema)
