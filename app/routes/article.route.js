const { http, paginateArticles } = require('../utils')
const { Article, Snapshot } = require('../models')
const helper = require('../utils/mongo.helper')

exports.Follow = async (req, res) => {
  const raw = await http.getArticle(req.body.id)
  const doc = await helper.createOrUpdateArticle(raw)
  res.send(doc)
}

exports.GetAll = async (req, res) => {
  const { skip, limit } = parseSkipAndLimit(req.query)
  const fields = '-_id -__v'
  try {
    const fullResponse = {
      skip,
      limit,
      total: await Article.estimatedDocumentCount(),
      page: await paginateArticles({ skip, limit, fields })
    }
    res.json(fullResponse)
  } catch (err) {
    res.status(400).send(err.message)
  }
}

exports.GetById = (req, res) => {
  Article.find({ id: req.params.id }, (err, [ article ]) => {
    if (err) res.status(500).send(err)
    else res.json(article)
  })
}

exports.Delete = (req, res) => {
  Article.remove({
    id: req.params.id
  }, (err) => {
    if (err) res.status(500).send(err)
    else res.json({ message: 'Successfully deleted' })
  })
}

exports.AddSnapshot = (req, res) => {
  Article.findById(req.params.id, (err, article) => {
    if (err) {
      res.status(500).send(err)
      return
    }
    const snapshot = new Snapshot(req.body)
    article.history.push(snapshot)
    article.save((err) => {
      if (err) res.status(500).send(err)
      else res.status(201).json(article)
    })
  })
}

function parseSkipAndLimit ({ skip, limit }) {
  const reg = /\D/g
  return {
    skip: reg.test(skip) ? 0 : +skip,
    limit: reg.test(limit) ? 50 : +limit
  }
}
