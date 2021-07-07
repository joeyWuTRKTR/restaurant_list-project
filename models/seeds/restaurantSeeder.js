const data = require('./restaurant.json')
const restaurantList = data.results
const Restaurant = require('../restaurant')

// connect to database
const db = require('../../config/mongoose')

db.once('open', () => {
  restaurantList.forEach((restaurant) =>
    Restaurant.create({
      id: restaurant.id,
      name: restaurant.name,
      name_en: restaurant.name_en,
      category: restaurant.category,
      image: restaurant.image,
      location: restaurant.location,
      phone: restaurant.phone,
      google_map: restaurant.google_map,
      rating: restaurant.rating,
      description: restaurant.description
    })
  )
  console.log('Success to set the seeder!')
})
