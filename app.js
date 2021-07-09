// import express
const express = require('express')
const app = express()

// include restaurant 
const restaurant = require('./models/restaurant')

// include mongoose
const mongoose = require('mongoose')
//connect to mongoDB
mongoose.connect('mongodb://localhost/restaurant-list', { useNewUrlParser: true, useUnifiedTopology: true })

// default port
const port = 3000

// import restaurant list 
const restaurantList = require('./restaurant.json')

// import handlebars template engine
const exphbs = require('express-handlebars')

// set template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// set static files
app.use(express.static('public'))

// check connection
const db = mongoose.connection

db.on('error', () => {
  console.log('mongoDB connect error!')
})

db.once('open', () => {
  console.log('mongoDB connected!')
})

app.get('/', (req, res) => {
  // 將餐廳名單重新排序，根據評分由低到高/由高到低,不需排序的話就直接傳原始資料
  if (req.query.order === 'asc' && req.query.sortBy === 'rating') {
    restaurantList.results.sort((a, b) => {
      // 評分由低到高
      return a.rating - b.rating
    })
  } else if (req.query.order === 'desc' && req.query.sortBy === 'rating') {
    restaurantList.results.sort((a, b) => {
      // 評分由高到低
      return b.rating - a.rating
    })
  }
  res.render('index', { restaurants: restaurantList.results })
})

// define show router
app.get('/restaurants/:restaurant_id', (req, res) => {
  const restaurant = restaurantList.results.find(restaurant => restaurant.id.toString() === req.params.restaurant_id)
  console.log(restaurant)
  res.render('show', { restaurant: restaurant })
})

// search router
app.get('/search', (req, res) => {
  const keyword = req.query.keyword
  const restaurants = restaurantList.results.filter(restaurant => restaurant.name.toLowerCase().includes(keyword.toLowerCase()))
  res.render('index', { restaurants: restaurants, keyword: keyword })
})


// set listener
app.listen(port, () => {
  console.log(`Express is listening on https://localhost:${port}`)
})