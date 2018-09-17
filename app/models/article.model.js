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

module.exports = mongoose.model('Article', ArticleSchema)
