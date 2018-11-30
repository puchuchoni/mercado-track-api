const { http, logger, createOrUpdateArticle, paginateArticles } = require('../../utils')
let running = false

async function processArticleChunk (articles) {
  try {
    const promises = articles.map(async (article) => {
      try {
        const raw = await http.searchByArticleId(article.id)
        return createOrUpdateArticle(raw)
      } catch (err) {
        logger.error(`[Error Sync Article ❌]: ${article.id}, ${err.message}`)
      }
    })
    return Promise.all(promises)
  } catch (err) {
    logger.error(`[Error Sync Article chunk]: ${err.message}`)
  }
}

exports.articlesSync = async (req, res) => {
  if (running) {
    return res.status(403).send({ message: `Sync already running` })
  }
  res.status(202).send({ message: `Sync triggered successfully` })
  console.log('Started Sync')
  running = true
  try {
    const limit = 1000
    let skip = 0
    let articles = await paginateArticles({})
    while (articles.length) {
      await processArticleChunk(articles)
      skip += 1000
      logger.info(`[Synced Articles batch ✔️]: #${skip}`)
      articles = await paginateArticles({ skip, limit })
    }
  } catch (error) {
    logger.error(`[Error Articles sync]: ${error.message}`)
  }
  running = false
}
