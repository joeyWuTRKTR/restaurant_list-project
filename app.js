// import express
const express = require('express')
// import body-parser
const bodyParser = require('body-parser')
// import handlebars template engine
const exphbs = require('express-handlebars')
// import method-override
const methodOverride = require('method-override')
const session = require('express-session')

require('dotenv').config()

// include restaurant 
const Restaurant = require('./models/restaurant')
// include routes
const routes = require('./routes')

const usePassport = require('./config/passport')
// include mongoose
require('./config/mongoose')

const app = express()

// default port
const port = 3000

// set template engine
app.engine('hbs', exphbs({ 
  defaultLayout: 'main', 
  extname: '.hbs',
  helpers: require('./controller/handlebarHelpers') 
}))

app.set('view engine', 'hbs')

// set static files
app.use(express.static('public'))
// use body-parser
app.use(bodyParser.urlencoded({ extended: true }))
// use method override
app.use(methodOverride('_method'))
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))

usePassport(app)
app.use((req, res, next) => { 
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  next()
})
// use routes
app.use(routes)

// set listener
app.listen(port, () => {
  console.log(`Express is listening on https://localhost:${port}`)
})