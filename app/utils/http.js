const axios = require('axios')
const http = require('http')
const https = require('https')
const hidden = require('./hidden')

const mlInstance = axios.create({
  baseURL: 'https://api.mercadolibre.com',
  timeout: 60000,
  httpAgent: new http.Agent({ keepAlive: true }),
  httpsAgent: new https.Agent({ keepAlive: true }),
  maxRedirects: 10
})

mlInstance.interceptors.response.use(
  (response) => response && response.data
)

class Http {
  constructor (instance) {
    this.http = instance
    this.accessToken = null
  }

  getToken () {
    return this.http.post('/oauth/token', {
      grant_type: 'client_credentials',
      client_id: hidden.mlClientId,
      client_secret: hidden.mlClientSecret
    }).then(res => res.access_token)
  }

  async searchByArticleId (id) {
    return this.http.get(`/items/${id}`)
  }

  getArticle (id) {
    return this.http.get(`/items/${id}`)
  }

  getCategory (id) {
    return this.http.get(`/categories/${id}`)
  }

  getMainCategories (market = 'MLA') {
    return this.http.get(`/sites/${market}/categories`)
  }

  async searchByCategory ({ market = 'MLA', categoryId, offset = 0, limit = 50 }) {
    if (!this.accessToken) {
      try {
        this.accessToken = await this.getToken()
      } catch (err) {
        throw err
      }
    }
    const url = `/sites/${market}/search`
    const options = {
      params: { access_token: this.accessToken, category: categoryId, offset, limit }
    }
    return new Promise((resolve, reject) => {
      this.http.get(url, options)
        .then(resolve)
        .catch(async (err) => {
          if (err.response && err.response.status === 401) {
            /* retrying if token has expired */
            try {
              this.accessToken = await this.getToken()
              this.http.get(url, options).then(resolve).catch(reject)
            } catch (err1) {
              reject(err1)
            }
          } else {
            reject(err)
          }
        })
    })
  }
}

module.exports = new Http(mlInstance)
