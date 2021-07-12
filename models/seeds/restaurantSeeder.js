const restaurantData = require('./restaurant.json')
const restaurantList = restaurantData.results
const Restaurant = require('../restaurant')

const db = require('../../config/mongoose')


db.once('open', () => {
  restaurantList.forEach(restaurant => {
    Restaurant.create({
      id: restaurant.id,
      name: restaurant.name,
      name_en: restaurant.name_en,
      category: restaurant.category,
      image_url: restaurant.image,
      location: restaurant.location,
      phone: restaurant.phone,
      google_map: restaurant.google_map,
      rating: restaurant.rating,
      description: restaurant.description
    })
  })
  console.log('Finished!')
})