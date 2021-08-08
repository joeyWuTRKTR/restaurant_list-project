if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const restaurantData = require('./restaurant.json')
const restaurantList = restaurantData.results
const Restaurant = require('../restaurant')
const User = require('../user')
const db = require('../../config/mongoose')
const bcrypt = require('bcryptjs')

const SEED_USERS = [
  {
    name: 'user1',
    email: 'user1@example.com',
    password: '12345678',
    belongRestaurants: [1, 2, 3]
  },
  {
    name: 'user2',
    email: 'user2@example.com',
    password: '12345678',
    belongRestaurants: [4, 5, 6]
  }
]

db.once('open', () => {
  Promise.all(SEED_USERS.map(SEED_USER => 
    bcrypt.genSalt(10)
      .then(salt => bcrypt.hash(SEED_USER.password, salt))
      .then(hash => User.create({
        name: SEED_USER.name,
        email: SEED_USER.email,
        password: hash
      }))
      .then(user => {
        // 過濾出分配的餐廳清單(by id)
        const restaurants = restaurantList.filter(restaurant => SEED_USER.belongRestaurants.includes(restaurant.id))
        restaurants.forEach(restaurant => { restaurant.userId = user._id })
        return Restaurant.create(restaurants)
      })
  ))
      .then(() => {
        console.log('done.')
        process.exit()
      })
      .catch(err => console.log(err))
})