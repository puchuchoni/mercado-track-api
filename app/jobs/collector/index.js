const categoriesCollector = require('./categories.collector')
const articlesCollector = require('./articles.collector')

module.exports = {
  ...categoriesCollector,
  ...articlesCollector
}
