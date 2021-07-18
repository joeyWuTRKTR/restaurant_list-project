// include express router
const express = require('express')
const router = express.Router()
const sortType = require('../../config/sortType.json')

// include restaurant 
const Restaurant = require('../../models/restaurant')

// import index.render
router.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .sort({ "name_en": "asc" })
    .then(restaurants =>  res.render('index', { restaurants, sortType }) )
    .catch(error => console.log(error))
})

// export module
module.exports = router