const express = require('express')
const passport = require('passport')
const router = express.Router()
const User = require('../../models/user')

// 1. 導入註冊頁
router.get('/register', (req, res) => {
  res.render('register')
})

// 2. 註冊完成
router.post('/register', (req, res) => {
  const { name , email, password, passwordConfirm } = req.body
  User.findOne({ email }).then(user => {
    if (user) {
      console.log('this email is registed already!')
      return res.render('register', {
        name, 
        email,
        password,
        passwordConfirm
      })
    } else {
      return User.create({
        name,
        email,
        password
      })
      .then(() => res.redirect('/'))
      .catch(err => console.log(err))
    }
  })
})


// 3. 導入登入頁
router.get('/login', (req, res) => {
  res.render('login')
})

// 4. 登入完成，導入餐廳頁面
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))

// 5. 登出
router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/users/login')
})

module.exports = router