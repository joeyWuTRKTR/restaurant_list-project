const express = require('express')
const exphbs = require('express-handlebars')
const Restaurant = require('./models/restaurant')

const app = express()
const PORT = 3000

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

// include mongoose and connect to database
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/restaurant-list', { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.on('error', () => { console.error('Failed to connect to mongoDB!') })
db.once('open', () => { console.log('The server is connected to mongoDB!') })

app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

app.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .then((restaurants) => res.render('index', { restaurants }))
    .catch((error) => console.error(error))
})

app.listen(PORT, () => {
  console.log(`Ther server is running on http://localhost:${PORT}`)
})
