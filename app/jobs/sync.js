const http = require('../../utils/http')
const { Article } = require('../models')

exports.syncData = async (req, res) => {
  const articles = await Article.find((err, articles) => {
    if (err) console.log(err)
    else return articles
  })

  const promises = articles.map(async article => {
    try {
      if (article.id) {
        const raw = await http.getArticle(article.id)
        let hasNewPrice = false
        const hasNewData = !(Object.keys(article._doc)
          .filter(prop => !prop.includes('_') && !prop.includes('history'))
          .every(prop => article._doc[prop] === raw[prop]))

        //  update article data
        if (hasNewData) {
          Object.keys(article._doc).map(function (key) {
            if (raw.hasOwnProperty(key)) {
              article[key] = raw[key]
            }
          })
        }

        //  update snapshot
        if (raw.price !== article.getLastPrice()) {
          hasNewPrice = true
          article.updatePrice(raw.price)
        }

        if (hasNewData || hasNewPrice) {
          article.save((err) => {
            if (err) console.log(err)
          })
        }
      }
    } catch (error) {
      console.log(error)
    }
  })

  Promise.all(promises).then(values => {
    console.log('Sync finished...')
    //res.send(articles)
  })
}
