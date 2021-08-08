const passport = require('passport')
const bcrypt = require('bcryptjs')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')

module.exports = app => {
  // middleware
  app.use(passport.initialize())
  app.use(passport.session())

  // strategy
  passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    User.findOne({ email })
      .then(user => {
        // email 未被註冊
        if (!user) {
          return done(null, false, { message: 'Email is not registed!'})
        }
        // email 或 password不正確
        // password 使用者的輸入值
        // user.password資料庫的雜湊值
        return bcrypt.compare(password, user.password).then(isMatch => {
          if (!isMatch) {
            return done(null, false, { message: 'Email or Password incorrect.'})
          }
          // 登入成功
          return done(null, user)
        })
      })
      .catch(err => done(err, false))
  }))
  // session
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .lean()
      .then(user => done(null, user))
      .catch(err => done(err, null))
  })
}