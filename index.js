const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const hidden = require('./utils/hidden')
const routes = require('./app/routes')
const cors = require('cors')
const cron = require('node-cron')
const sync = require('./app/jobs/sync')
const app = express()
const router = express.Router()
const port = hidden.port
const logger = require('./utils/logger')

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
  .post(routes.article.AddSnapshot)

router.route('/sync')
  .post(sync.syncData)

app.use('/api', router)
app.listen(port)
logger.info('Mercado Track Api is running on port:' + port)

cron.schedule('*/45 * * * *', () => {
  logger.info('Run sync...')
  sync.syncData()
})
