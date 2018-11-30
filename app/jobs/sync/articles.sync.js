const { http, logger, createOrUpdateArticle, paginateArticles } = require('../../utils')
const { Article } = require('../../models')
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

async function articlesSync (singleRun = false) {
  try {
    running = true
    const limit = 1000
    let skip = 0
    const count = await Article.estimatedDocumentCount().exec()
    let articles = await paginateArticles({})
    while (articles.length) {
      await processArticleChunk(articles)
      skip += 1000
      const percentage = (skip * 100 / count).toFixed(3)
      logger.info(`[Sync]: ${skip}/${count} - ${percentage}%`)
      articles = await paginateArticles({ skip, limit })
    }
    if (singleRun) {
      running = false
    } else {
      articlesSync()
    }
  } catch (error) {
    logger.error(`[Error Articles sync]: ${error.message}`)
    running = false
  }
}

function run () {
  try {
    articlesSync()
  } catch (err) {
    console.log(err)
    logger.error(`[Fatal] There was an error running the Articles sync`)
  }
}

async function articlesSyncRoute (req, res) {
  if (running) return res.status(403).send({ message: `Sync already running` })
  res.status(202).send({ message: `Sync triggered successfully` })
  console.log('Triggered sync')
  await articlesSync()
}

module.exports = { articlesSyncRoute, run }
