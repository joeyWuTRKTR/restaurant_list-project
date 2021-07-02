// include express and model
const express = require('express')
const exphbs = require('express-handlebars')
const Restaurant = require('./models/restaurant')
const methodOverride = require('method-override')

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
app.use(methodOverride('_method'))

// index route
app.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .then((restaurants) => res.render('index', { restaurants }))
    .catch((error) => console.error(error))
})

// search route
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

// create route
app.get('/restaurants/new', (req, res) => {
  res.render('new')
})

app.post('/restaurants', (req, res) => {
  const { name, name_en, category, image, location, phone, google_map, rating, description } = req.body
  if (!name || !name_en || !category || !image || !location || !phone || !google_map || !rating || !description) {
    return res.redirect('/restaurants/new')
  }
  return Restaurant.create({ name, name_en, category, image, location, phone, google_map, rating, description
  })
    .then(() => res.redirect('/'))
    .catch((error) => console.error(error))
})

// edit route
app.get('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  if (!mongoose.Types.ObjectId.isValid(id)) return res.redirect('back')
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('edit', { restaurant }))
    .catch(error => console.error(error))
})

app.put('/restaurants/:id', (req, res) => {
  const id = req.params.id
  if (!mongoose.Types.ObjectId.isValid(id)) return res.redirect('back')
  const modifiedRestaurant = req.body
  return Restaurant.findById(id)
    .then(restaurant => {
      restaurant.name = modifiedRestaurant.name
      restaurant.name_en = modifiedRestaurant.name_en
      restaurant.category = modifiedRestaurant.category
      restaurant.image = modifiedRestaurant.image
      restaurant.location = modifiedRestaurant.location
      restaurant.phone = modifiedRestaurant.phone
      restaurant.google_map = modifiedRestaurant.google_map
      restaurant.rating = modifiedRestaurant.rating
      restaurant.description = modifiedRestaurant.description
      return restaurant.save()
    })
    .then(() => res.redirect(`/restaurants/${id}`))
    .catch(error => console.error(error))
})

// detail route
app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id
  if (!mongoose.Types.ObjectId.isValid(id)) return res.redirect('back')
  return Restaurant.findById(id)
    .lean()
    .then((restaurant) => res.render('detail', { restaurant }))
    .catch((error) => console.error(error))
})

app.listen(PORT, () => {
  console.log(`The server is running on http://localhost:${PORT}`)
})
