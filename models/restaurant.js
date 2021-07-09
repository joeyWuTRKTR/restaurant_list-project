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
    required: true
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
    required: true,
  },

  phone: {
    type: String,
    required: true
  },
  
  google_map: {
    type: String,
    required: true
  },
  
  rating: {
    type: Number,
    required: true
  },

  description: {
    type: String,
    required: true
  }
})
// export module
module.exports = mongoose.model('Restaurant', restaurantSchema)