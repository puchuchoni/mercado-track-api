const { http, createOrUpdateArticle, logger } = require('../../utils')
const { Category } = require('../../models')

let running = false
const limit = 50
const maxOffset = 10000

module.exports = { fetchAllArticles }

async function fetchAllArticles (req, res) {
  if (running) {
    return res.status(403).send({ message: `Articles collect already running` })
  }
  res.status(202).send({ message: `Articles collect triggered successfully` })
  running = true
  try {
    console.log(`Fetching all categories from db...`)
    const categories = await Category.find({})
    let i = 0
    for (const category of categories) {
      i++
      try {
        await processArticlesByCategory(category.id)
        logger.info(`[Collected Articles by Category ✔️]: ${category.id} - ${i}/${categories.length}`)
      } catch (err) {
        logger.error(`[Collected Articles by Category ❌]: ${i}/${categories.length} - ${err.message}`)
      }
    }
  } catch (err) {
    logger.error(err.message)
  }
  running = false
}

async function processArticlesByCategory (categoryId) {
  try {
    const page = await http.searchByCategory({ categoryId })
    const pagesTotal = Math.ceil(page.paging.total / limit)
    const promises = []
    for (let pageNumber = 0; pageNumber < pagesTotal && pageNumber * limit <= maxOffset; pageNumber++) {
      const promise = processPage(pageNumber, categoryId)
      promises.push(promise)
    }
    return Promise.all(promises)
  } catch (err) {
    logger.error(`[Error collecting Articles by Category]: ${categoryId} - ${err.message}`)
  }
}

async function processPage (pageNumber, categoryId) {
  try {
    const offset = pageNumber * limit
    const page = await http.searchByCategory({ categoryId, offset, limit })
    const promises = page.results.map(async (item) => {
      try {
        const res = await createOrUpdateArticle(item)
        return res
      } catch (err) {
        logger.error(`[Error Article collect ❌]: ${item.id}, ${err.message}`)
        return Promise.reject(err)
      }
    })
    return Promise.all(promises)
  } catch (err) {
    logger.error(`[Error collecting Articles page]: #${pageNumber}, ${err.message}`)
  }
}
