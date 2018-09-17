const http = require('../../utils/http')
const { Article, Snapshot } = require('../models')

exports.Follow = async (req, res) => {
  const raw = await http.getArticle(req.params.id)
  const snapshot = new Snapshot({
    price: raw.price,
    date: new Date()
  })
  const article = new Article({
    ...raw,
    history: [ snapshot ]
  })
  article.save((err, article) => {
    if (err) res.send(err)
    else res.send(article)
  })
}

exports.GetAll = (req, res) => {
  Article.find((err, articles) => {
    if (err) res.send(err)
    else res.json(articles)
  })
}

exports.GetById = (req, res) => {
  Article.find({ id: req.params.id }, (err, article) => {
    if (err) res.send(err)
    else res.json(article)
  })
}

exports.Delete = (req, res) => {
  Article.remove({
    _id: req.params.id
  }, (err) => {
    if (err) res.send(err)
    else res.json({ message: 'Successfully deleted' })
  })
}

exports.AddSnapshot = (req, res) => {
  Article.findById(req.params.id, (err, article) => {
    if (err) {
      res.send(err)
      return
    }
    const snapshot = new Snapshot(req.body)
    article.history.push(snapshot)
    article.save((err) => {
      if (err) res.send(err)
      else res.json(article)
    })
  })
}
