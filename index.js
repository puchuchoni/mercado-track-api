const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const hidden = require('./app/utils/hidden')
const routes = require('./app/routes')
// const cron = require('node-cron')
const sync = require('./app/jobs/sync')
const collector = require('./app/jobs/collector')
const app = express()
const router = express.Router()
const port = hidden.port
const logger = require('./app/utils/logger')
const cors = require('cors')

mongoose.set('useCreateIndex', true)
mongoose.connect(hidden.dbUrl, { useNewUrlParser: true })

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())

router.route('/articles')
  .post(routes.article.Follow)
  .get(routes.article.GetAll)

router.route('/articles/:id')
  .get(routes.article.GetById)
  .delete(routes.article.Delete)

router.route('/sync/articles')
  .post(sync.articlesSync)

router.route('/collector/categories')
  .post(collector.getAllCategories)

router.route('/collector/articles')
  .post(collector.fetchAllArticles)

app.use('/', router)
app.listen(port)
logger.info(`Mercado Track API running on port: ${port}`)

// cron.schedule('0 0 6,18 * * *', () => {
//   logger.info(`Dispatch sync Job`)
//   sync.articlesSync()
// })

// cron.schedule('0 0 0 * * *', () => {
//   logger.info(`Dispatch articles collector Job`)
//   collector.fetchAllArticles()
// })

// cron.schedule('* * 1 * *', () => {
//   logger.info(`Dispatch categories collector Job`)
//   collector.getAllCategories()
// })

// Process Categories
// require('./app/jobs/collector').getAllCategories().then(() => process.exit())

// Process Articles
// require('./app/jobs/collector').fetchAllArticles().then(() => process.exit())

// Article Sync
// require('./app/jobs/sync').articlesSync().then(() => process.exit())
