const request = require('request')

const quotes = (callback) => {
  const quotesUrl = 'https://type.fit/api/quotes'
  // const proxyUrl = 'https://cors-anywhere.herokuapp.com/'

  // Requesting quotes
  request({ url: quotesUrl, json: true }, (error, response) => {
    if (error) {
      callback('', undefined)
    } else {
      callback(undefined, response)
    }
  })
}

module.exports = quotes