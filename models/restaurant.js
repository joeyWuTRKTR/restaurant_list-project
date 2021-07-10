// include mongoose
const mongoose = require('mongoose')
// import schema
const Schema = mongoose.Schema
// define schema
const restaurantSchema = new Schema({
  name: {
    type: String,
    required: true
  },

  name_en: {
    type: String,
  },

  category: {
    type: String,
    required: true
  },

  image: {
    type: String,
    required: true
  },

  location: {
    type: String,
  },

  phone: {
    type: String,
  },
  
  google_map: {
    type: String,
  },
  
  rating: {
    type: Number,
    required: true
  },

  description: {
    type: String,
  }
})
// export module
module.exports = mongoose.model('Restaurant', restaurantSchema)