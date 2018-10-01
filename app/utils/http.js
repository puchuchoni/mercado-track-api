const axios = require('axios')

const mlInstance = axios.create({
  baseURL: 'https://api.mercadolibre.com'
})

class Http {
  constructor (instance) {
    this.http = instance
  }

  getArticle (id) {
    return this.http.get(`/items/${id}`, {
      responseType: 'json'
    }).then(res => res.data)
  }
}

module.exports = new Http(mlInstance)
