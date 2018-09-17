const axios = require('axios')

const mlInstance = axios.create({
  baseURL: 'https://api.mercadolibre.com'
})

class Http {
  constructor (instance) {
    this.http = instance
  }

  getArticle (id, market = 'MLA') {
    return this.http.get(`/items/${market}${id}`, {
      responseType: 'json'
    }).then(res => res.data)
  }
}

module.exports = new Http(mlInstance)
