// include express router
const express = require('express')
const router = express.Router()

// import home.js & restaurants.js
const home = require('./modules/home')
const restaurants = require('./modules/restaurants')
const users = require('./modules/users')
const auth = require('./modules/auth')
const { authenticator } = require('../middleware/auth')

router.use('/restaurants/', authenticator ,restaurants)
router.use('/users', users)
router.use('/auth', auth)
router.use('/', authenticator,home)

// export module
module.exports = router