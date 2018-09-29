const http = require('../utils/http')
const { Article } = require('../models')
const logger = require('../utils/logger')

exports.syncData = async (req, res) => {
  let articles
  try {
    articles = await Article.find((err, articles) => {
      if (err) logger.error(err)
      else return articles
    })

    const promises = articles.map(async article => {
      const raw = await http.getArticle(article.id)
      Object.keys(article._doc).forEach(key => {
        if (key in raw) article[key] = raw[key]
      })

      if (raw.price !== article.getLastPrice()) {
        article.updatePrice(raw.price)
      }

      if (article.isModified()) {
        article.save((err) => {
          logger.info(`Article ${article.id} updated`)
          if (err) logger.error(err)
        })
      }
    })

    Promise.all(promises).then(() => {
      logger.info('Sync finished...')
      res.sendStatus(200)
    })
  } catch (error) {
    logger.error(error)
    return res.sendStatus(500)
  }
}
