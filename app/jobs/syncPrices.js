const http = require('../../utils/http')
const { Article, Snapshot } = require('../models')

const getLastPrice = (article) => {
  return article.history.length === 0 ? 0 : article.history[article.history.length - 1].price
}

exports.syncPrices = async (req, res) => {
  const articles = await Article.find((err, articles) => {
    if (err) console.log(err)
    else return articles
  })

  const promises = articles.map(async article => {
    try {
      if (article.id) {
        const raw = await http.getArticle(article.id)
        let newData = false
        let newPrice = false
        const isEqual = Object.keys(article)
          .filter(prop => !prop.includes('_'))
          .every(prop => article._doc[prop] === raw[prop])

        //  update article data
        if (!isEqual) {
          Object.assign(article, raw)
          newData = true
        }

        //  update snapshot
        if (raw.price !== getLastPrice(article)) {
          newPrice = true
          article.history.push(new Snapshot({
            price: raw.price,
            date: new Date()
          }))
        }

        if (newData || newPrice) {
          article.save((err) => {
            if (err) console.log(err)
          })
        }

        return article
      }
    } catch (error) {
      console.log(error)
    }
  })

  Promise.all(promises).then(values => {
    res.send(articles)
  })
}
