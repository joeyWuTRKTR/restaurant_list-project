// include express router
const express = require('express')
const router = express.Router()
const sortType = require('../../config/sortType.json')

// include restaurant 
const Restaurant = require('../../models/restaurant')

// search router
router.get('/search', (req, res) => {
  const keyword = req.query.keyword.trim().toLowerCase()
  const currentSortOption = req.query.sortOption
  console.log(currentSortOption)
  const sortMongoose = {
    nameEnAsc: { name_en: 'asc' },
    nameEnDesc: { name_en: 'desc' },
    category: { category: 'asc' },
    location: { location: 'asc' }
  }
  console.log(sortMongoose[currentSortOption])
  // if (keyword <= 0) {
  //   return res.redirect('/')
  // }
  Restaurant.find()
    .lean()
    .sort(sortMongoose[currentSortOption])
    .then(restaurants => {
      if (keyword) {
        restaurants = restaurants.filter(restaurant => 
          restaurant.name.toLowerCase().includes(keyword) || 
          restaurant.category.includes(keyword))
      } 
      
      if (restaurants.length === 0) {
        return res.render('index', { no_result: `<h3> 搜尋不到此餐廳，請換一家搜尋 </h3>` })
      }

      res.render('index', {
        restaurants,
        keyword: req.query.keyword.trim(),
        sortType,
        currentSortOption
      })
    })
    .catch(error => console.log(error))
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
router.delete('/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

// export module
module.exports = router