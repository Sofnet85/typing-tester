const express = require('express')
const path = require('path')
const quotes = require('./utils/quotes')

const app = express()
const port = process.env.PORT || 3000

//Path for the public directory
const publicDirectoryPath = path.join(__dirname, '../public')
console.log(publicDirectoryPath)

//Serving the main page (index.html)
app.use(express.static(publicDirectoryPath))

app.get('index', (req, res) => {
  quotes((error, quotes) => {
    console.log(quotes)
    if (error) {
      return res.send({error: 0})
    } else

    res.send(quotes)
  })
})

//Server up and running
app.listen(port, () => console.log('Server is up on Port ' + port))