const express = require('express')
const path = require('path')
const quotes = require('./utils/quotes')
const fs = require('fs')

const app = express()
const port = process.env.PORT || 3000

//Path for the public directory
const publicDirectoryPath = path.join(__dirname, '../public')

// Creating the quotes js file
quotes((error, quotes) => {
  if (error) {
    return res.send({error: 0})
  } else {
    //Getting just a certain number of quotes
    let array = []
    for (i=0; i<200; i++) {
      array.push(quotes.body[i])
    }
    //Converting json to string
    const data = JSON.stringify(array)
    //write file in public folder in blocking mode
    fs.writeFileSync('../public/js/quotes.js', 'const allQuotes = ' + data)
  }
})

//Serving the main page (index.html)
app.use(express.static(publicDirectoryPath))

//Server up and running
app.listen(port, () => console.log('Server is up on Port ' + port))