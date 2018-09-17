const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SnapshotSchema = new Schema({
  price: Number,
  date: Date
})

module.exports = mongoose.model('Snapshot', SnapshotSchema)
