// include express router
const express = require('express')
const router = express.Router()

// import home.js & restaurants.js
const home = require('./modules/home')
const restaurants = require('./modules/restaurants')

router.use(home)
router.use(restaurants)

// export module
module.exports = router