const express = require('express')
const path = require('path')

const app = express()
//Path for the public directory
const publicDirectoryPath = path.join(__dirname, '../public')

//Serving the index.html
app.use(express.static(publicDirectoryPath))



//Server up and running
app.listen(3000, () => console.log('Server is up on Port 3000'))