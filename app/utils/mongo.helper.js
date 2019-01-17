const { Snapshot, Article, Category } = require('../models')
const { logger } = require('../utils')

module.exports = { createOrUpdateArticle, addCategory, paginateArticles }

function createOrUpdateArticle (item) {
  return new Promise(async (resolve, reject) => {
    const snapshot = new Snapshot({ price: item.price, original_price: item.original_price })
    const images = item.pictures && item.pictures.map(picture => picture.url)
    const article = {
      ...item,
      $addToSet: {
        history: snapshot,
        images
      }
    }
    try {
      const [ localArticle ] = await Article.find({ id: item.id })
      if (localArticle) {
        if (localArticle.shouldUpdate(item, images)) {
          localArticle.updateOne(article, (err, doc) => {
            if (err) reject(err)
            else resolve(doc)
          })
        } else resolve(localArticle)
      } else {
        const _article = Object.assign({ history: [snapshot], images }, item)
        const article = new Article(_article)
        if (article.shouldCreate()) {
          article.save((err, doc) => {
            if (err) reject(err)
            else resolve(doc)
          })
        } else resolve('article not active')
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

async function paginateArticles ({ search, skip = 0, limit = 200 }) {
  if (limit > 1000) return Promise.reject(new Error({ message: 'Using a limit higher than 1k is not allowed.' }))
  const fields = '-_id -__v'
  const query = search ? { $text: { $search: search } } : {}
  try {
    const articles = await Article.find(query, fields, { skip, limit }).exec()
    const total = search
      ? await Article.find(query).count().exec()
      : await Article.estimatedDocumentCount()
    return { articles, total }
  } catch (err) {
    return Promise.reject('There was an error when paginating articles', err)
  }
}
