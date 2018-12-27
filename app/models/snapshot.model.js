const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SnapshotSchema = new Schema({
  original_price: Number,
  price: Number,
  discount: Number,
  date: {
    type: Date,
    default: new Date()
  }
}, { _id: false })

SnapshotSchema.pre('save', function (next) {
  this.discount = Math.floor(((this.original_price - this.price) * 100) / this.original_price)
  next()
})

module.exports = mongoose.model('Snapshot', SnapshotSchema)
