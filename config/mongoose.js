// include mongoose
const mongoose = require('mongoose')
//connect to mongoDB
mongoose.connect('mongodb://localhost/restaurant-list', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })

// check connection
const db = mongoose.connection

db.on('error', () => {
  console.log('mongoDB connect error!')
})

db.once('open', () => {
  console.log('mongoDB connected!')
})

module.exports = db