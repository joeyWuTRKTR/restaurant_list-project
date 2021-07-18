// include express router
const express = require('express')
const router = express.Router()
const sortType = require('../../config/sortType.json')

// include restaurant 
const Restaurant = require('../../models/restaurant')

// search router
router.get('/search', (req, res) => {
  const keyword = new RegExp(req.query.keyword.trim(), 'i')

  let currentSortOption = req.query.sortOption

  Restaurant.find({ $or: [{ name: keyword}, { category: keyword }] })
    .lean()
    .sort(sortType[currentSortOption].mongoose)
    .then(restaurants => {
      if (restaurants.length > 0) {
        res.render('index', {
          restaurants,
          keyword: req.query.keyword.trim(),
          sortType,
          currentSortOption
        })
      } else {
        res.render('index', { no_result: `<h3>Couldn't fine the restaurant, try another one!</h3>` })
      }
    })
})

// Create
router.get('/new', (req, res) => {
  return res.render('new')
})

router.post('/', (req, res) => {
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
    return res.redirect('/new')
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
router.get('/restaurant/:id', (req, res) => {
  const id = req.params.id
  console.log(id)
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('detail', { restaurant }))
    .catch(error => console.log(error))
})



// Update
router.get('/:id', (req, res) => {
  const id = req.params.id
  console.log(id)
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('edit', { restaurant }))
    .catch(error => console.log(error))
})

router.put('/:id', (req, res) => {
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
      Object.assign(restaurant, req.body)
      // restaurant.name = name,
    //   restaurant.name_en = name_en,
    //   restaurant.category = category,
    //   restaurant.image = image,
    //   restaurant.location = location,
    //   restaurant.phone = phone,
    //   restaurant.google_map = google_map,
    //   restaurant.rating = rating,
    //   restaurant.description = description
      return restaurant.save()
    })
    .then(restaurant => res.redirect(`/restaurants/restaurant/${restaurant._id}`))
    .catch(error => console.log(error))
})

// Delete
router.delete('/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

// export module
module.exports = router