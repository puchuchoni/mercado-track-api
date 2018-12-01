const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const hidden = require('./app/utils/hidden')
const routes = require('./app/routes')
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
  .post(sync.articlesSyncRoute)

router.route('/collector/categories')
  .post(collector.getAllCategories)

router.route('/collector/articles')
  .post(collector.fetchAllArticles)

app.use('/', router)
app.listen(port)
logger.info(`Mercado Track API running on port: ${port}`)

// Articles sync
sync.run()
