// import express
const express = require('express')
const app = express()

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

// define router
app.get('/', (req, res) => {
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