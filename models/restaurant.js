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

  image_url: {
    type: String,
    required: true
  },

  location: {
    type: String,
    required: true
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
  },
  // 關聯設定: 參照User 的 ObjectId
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true,
    required: true
  }
})
// export module
module.exports = mongoose.model('Restaurant', restaurantSchema)