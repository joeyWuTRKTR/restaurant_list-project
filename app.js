// import express
const express = require('express')
const app = express()

// import body-parser
const bodyParser = require('body-parser')

// include restaurant 
const Restaurant = require('./models/restaurant')

// include mongoose
const mongoose = require('mongoose')
//connect to mongoDB
mongoose.connect('mongodb://localhost/restaurant-list', { useNewUrlParser: true, useUnifiedTopology: true })

// default port
const port = 3000

// import handlebars template engine
const exphbs = require('express-handlebars')
// set template engine
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

// set static files
app.use(express.static('public'))

// use body-parser
app.use(bodyParser.urlencoded({ extended: true }))

// check connection
const db = mongoose.connection

db.on('error', () => {
  console.log('mongoDB connect error!')
})

db.once('open', () => {
  console.log('mongoDB connected!')
})

app.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .then(restaurants => {
      // 將餐廳名單重新排序，根據評分由低到高/由高到低,不需排序的話就直接傳原始資料
      if (req.query.order === 'asc' && req.query.sortBy === 'rating') {
        restaurants.sort((a, b) => {
          // 評分由低到高
          return a.rating - b.rating
        })
      } else if (req.query.order === 'desc' && req.query.sortBy === 'rating') {
        restaurants.sort((a, b) => {
          // 評分由高到低
          return b.rating - a.rating
        })
      }
      res.render('index', { restaurants })
    })
    .catch(error => console.log(error))
})

// Create
app.get('/restaurants/new', (req, res) => {
  return res.render('new')
})

app.post('/restaurants', (req, res) => {
  const { 
    name,
    name_en,
    category,
    image,
    location,
    phone,
    google_map,
    rating,
    description,
  } = req.body

  // if ( 
  //   !name ||
  //   !category ||
  //   !image ||
  //   !location ||
  //   !phone ||
  //   !google_map ||
  //   !rating ||
  //   !description
  // ) {
  //   return res.redirect('/restaurants/new')
  // }
  return Restaurant.create({
    name,
    name_en,
    category,
    image,
    location,
    phone,
    google_map,
    rating,
    description,
  })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

// Read
app.get('/restaurants/restaurant/:id', (req, res) => {
  const id = req.params.id
  console.log(id)
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('detail', { restaurant }))
    .catch(error => console.log(error))
})

// Update
app.get('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  console.log(id)
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('edit', { restaurant }))
    .catch(error => console.log(error))
})

app.post('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  const {
    name,
    name_en,
    category,
    image,
    location,
    phone,
    google_map,
    rating,
    description,
  } = req.body
  return Restaurant.findById(id)
    .then(restaurant => {
      restaurant.name = name,
      restaurant.name_en = name_en,
      restaurant.category = category,
      restaurant.image = image,
      restaurant.location = location,
      restaurant.phone = phone,
      restaurant.google_map = google_map,
      restaurant.rating = rating,
      restaurant.description = description
      return restaurant.save()
    })
    .then(restaurant => res.redirect(`/restaurants/restaurant/${restaurant._id}`))
    .catch(error => console.log(error))
})

// Delete
app.post('/restaurants/:id/delete', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
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