// include express and model
const express = require('express')
const exphbs = require('express-handlebars')
const Restaurant = require('./models/restaurant')

const app = express()
const PORT = 3000

// set view templates
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

// include mongoose and connect to database
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/restaurant-list', { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.on('error', () => { console.error('Failed to connect to mongoDB!') })
db.once('open', () => { console.log('The server is connected to mongoDB!') })

// middleware
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

// routes
app.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .then((restaurants) => res.render('index', { restaurants }))
    .catch((error) => console.error(error))
})

app.get('/restaurants/searches', (req, res) => {
  const keyword = req.query.keyword.trim().toLowerCase()
  Restaurant.find()
    .lean()
    .then((restaurants) => {
      if (keyword) {
        restaurants = restaurants.filter((restaurant) =>
          restaurant.name.toLowerCase().includes(keyword) ||
          restaurant.category.includes(keyword))
      }
      if (restaurants.length === 0) {
        const error = '很遺憾，沒有符合搜尋的結果。'
        return res.render('index', { error })
      }
      res.render('index', { restaurants })
    })
    .catch((error) => console.error(error))
})

app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then((restaurant) => res.render('detail', { restaurant }))
    .catch((error) => console.error(error))
})



app.listen(PORT, () => {
  console.log(`The server is running on http://localhost:${PORT}`)
})
