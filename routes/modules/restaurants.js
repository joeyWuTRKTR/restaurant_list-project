// include express router
const express = require('express')
const router = express.Router()

// include restaurant 
const Restaurant = require('../../models/restaurant')

// Create
router.get('/restaurants/new', (req, res) => {
  return res.render('new')
})

router.post('/restaurants', (req, res) => {
  const {
    name,
    name_en,
    category,
    image_url,
    location,
    phone,
    google_map,
    rating,
    description,
  } = req.body
  // check whether contains the needs
  if (
    !name ||
    !category ||
    !image_url ||
    !location ||
    !phone ||
    !google_map ||
    !rating ||
    !description
  ) {
    return res.redirect('/restaurants/new')
  }

  return Restaurant.create({
    name,
    name_en,
    category,
    image_url,
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
router.get('/restaurants/restaurant/:id', (req, res) => {
  const id = req.params.id
  console.log(id)
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('detail', { restaurant }))
    .catch(error => console.log(error))
})



// Update
router.get('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  console.log(id)
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('edit', { restaurant }))
    .catch(error => console.log(error))
})

router.post('/restaurants/:id/edit', (req, res) => {
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
router.post('/restaurants/:id/delete', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

// search router
router.get('/restaurants/search', (req, res) => {
  const keyword = req.query.keyword.trim().toLowerCase()
  // if input space, length = 0, invalid input
  if (keyword <= 0) {
    return res.redirect('/')
  }
  Restaurant.find()
    .lean()
    .then(restaurants => {
      if (restaurants.length >= 0) {
        // if restaurant or category matches, render index 
        restaurants = restaurants.filter(restaurant => restaurant.name.toLowerCase().includes(keyword) || restaurant.category.includes(keyword))
        return res.render('index', {
          restaurants, keyword: req.query.keyword.trim()
        })
      } else { // if no result matches, render no_result
        res.render('index', {
          keyword: req.query.keyword,
          no_result: `<h3>No results, please search another restaurant </h3>`
        })
      }
    })
    .catch(error => console.log(error))
})

// export module
module.exports = router