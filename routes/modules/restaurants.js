// include express router
const express = require('express')
const router = express.Router()
const sortType = require('../../config/sortType.json')

// include restaurant 
const Restaurant = require('../../models/restaurant')

// search router
router.get('/search', (req, res) => {
  const keyword = new RegExp(req.query.keyword.trim(), 'i') // case-insensitive
  let currentSortOption = req.query.sortOption

  Restaurant.find({ $or: [{ name: keyword}, { category: keyword }], userId: req.user._id })
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
  const userId = req.user._id
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
    userId
  })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

// Read
router.get('/restaurant/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return Restaurant.findOne({ _id, userId })
    .lean()
    .then(restaurant => res.render('detail', { restaurant }))
    .catch(error => console.log(error))
})



// Update
router.get('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return Restaurant.findOne({ _id, userId })
    .lean()
    .then(restaurant => res.render('edit', { restaurant }))
    .catch(error => console.log(error))
})

router.put('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
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
  return Restaurant.findOne({ _id, userId })
    .then(restaurant => {
      Object.assign(restaurant, userId, req.body) // 只修改新增的部分，舊的沿用，同時全部併入目標物件(restaurant)
      return restaurant.save()
    })
    .then(restaurant => res.redirect(`/restaurants/restaurant/${restaurant._id}`))
    .catch(error => console.log(error))
})

// Delete
router.delete('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return Restaurant.findOne({ _id, userId })
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

// export module
module.exports = router