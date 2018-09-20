const http = require('../../utils/http')
const { Article, Snapshot } = require('../models')

exports.syncPrices = async (req, res) => {
    const articles = await
        Article.find((err, articles) => {
            if (err) console.log(err)
            else return articles
          })

    articles.forEach(async article => {
        try {
            if (article.id) {
                const raw = await http.getArticle(article.id)
                snapshots = orderByDate(article.history, 'date')
                if (snapshots.length == 0 || raw.price !== snapshots[0].price) {
                    article.history.push(new Snapshot({
                        price: raw.price,
                        date: new Date()
                      }))
                    article.save((err) => {
                        if (err) console.log(err)
                    })
                }
            }
        }
        catch(error) {
            console.log(error)
        }
    })

    console.log(articles);
    res.send(articles)
}

 orderByDate = (arr, dateProp) => {
    return arr.slice().sort(function (a, b) {
      return a[dateProp] < b[dateProp] ? -1 : 1;
    });
  }