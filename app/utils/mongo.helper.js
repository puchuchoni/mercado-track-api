const { Snapshot, Article, Category } = require('../models')
const { logger } = require('./logger')

module.exports = { createOrUpdateArticle, addCategory, paginateArticles, searchArticles }

function createOrUpdateArticle (item) {
  return new Promise(async (resolve, reject) => {
    const snapshot = new Snapshot({ price: item.price })
    const article = {
      ...item,
      $addToSet: {
        history: snapshot
      }
    }
    try {
      const [ localArticle ] = await Article.find({ id: item.id })
      if (localArticle) {
        if (localArticle.getLastPrice() !== item.price) {
          localArticle.updateOne(article, (err, doc) => {
            if (err) reject(err)
            else resolve(doc)
          })
        } else resolve(localArticle)
      } else {
        const _article = Object.assign({ history: [snapshot] }, item)
        const article = new Article(_article)
        article.save((err, doc) => {
          if (err) reject(err)
          else resolve(doc)
        })
      }
    } catch (err) {
      logger.error(`${item.id}: ${err.message}`)
    }
  })
}

function addCategory (id) {
  const category = { id }
  return new Promise((resolve, reject) => {
    Category.findOneAndUpdate({
      id: category.id
    }, category, { upsert: true, new: true }, (err, doc) => {
      if (err) {
        reject(err)
        return
      }
      resolve(doc)
    })
  })
}

function paginateArticles ({ query = {}, skip = 0, limit = 200 }) {
  if (limit > 1000) return Promise.reject(new Error({ message: 'Using a limit higher than 1k is not allowed.' }))
  return new Promise((resolve, reject) => {
    const fields = '-_id -__v'
    Article.find(query, fields, { skip, limit }, (err, articles) => {
      if (err) reject(err)
      else resolve(articles)
    })
  })
}

function searchArticles ({ search, skip = 0, limit = 50 }) {
  const fields = '-_id -__v'
  return Article.find({ $text: { $search: search } }, fields, { skip, limit }).exec()
}
