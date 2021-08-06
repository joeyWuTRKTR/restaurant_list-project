// include express router
const express = require('express')
const router = express.Router()

// import home.js & restaurants.js
const home = require('./modules/home')
const restaurants = require('./modules/restaurants')
const users = require('./modules/users')

router.use('/', home)
router.use('/restaurants/', restaurants)
router.use('/users', users)

// export module
module.exports = router