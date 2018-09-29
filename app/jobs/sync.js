const http = require('../../utils/http')
const { Article } = require('../models')

exports.syncData = async (req, res) => {
  let articles
  try {
    articles = await Article.find((err, articles) => {
      if (err) console.log(err)
      else return articles
    })
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }

  const promises = articles.map(async article => {
    try {
      const raw = await http.getArticle(article.id)
      Object.keys(article._doc).forEach(key => {
        if (key in raw) article[key] = raw[key]
      })

      if (raw.price !== article.getLastPrice()) {
        article.updatePrice(raw.price)
      }

      if (article.isModified()) {
        article.save((err) => {
          if (err) console.log(err)
        })
      }
    } catch (error) {
      console.log(error)
    }
  })

  Promise.all(promises).then(() => {
    console.log('Sync finished...')
    res.sendStatus(200)
  })
}
