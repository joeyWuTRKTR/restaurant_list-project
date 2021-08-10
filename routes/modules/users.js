const express = require('express')
const passport = require('passport')
const bcrypt = require('bcryptjs')
const router = express.Router()
const User = require('../../models/user')

// 1. 導入註冊頁
router.get('/register', (req, res) => {
  res.render('register')
})
// 2. 註冊完成
router.post('/register', (req, res) => {
  const { name , email, password, passwordConfirm } = req.body
  const errors = []
  // 欄位輸入錯誤
  if (!name || !email || !password || !passwordConfirm) {
    errors.push({ message: '欄位填寫錯誤。' })
  }
  // 密碼和驗證密碼不一致
  if (password !== passwordConfirm) {
    errors.push({ message: '密碼和驗證密碼不一致。' })
  }
  if (errors.length) {
    return res.render('register', {
      errors,
      name,
      email,
      password,
      passwordConfirm
    })
  }

  User.findOne({ email }).then(user => {
    if (user) {
      errors.push({ message: '此帳號已經註冊過!' })
      return res.render('register', {
        errors,
        name, 
        email,
        password,
        passwordConfirm
      })
    }
    return bcrypt
      .genSalt(10) // 產生"鹽"，複雜度係數10
      .then(salt => bcrypt.hash(password, salt)) // 為使用者密碼"加鹽"，產生雜湊值
      .then(hash => User.create({
        name,
        email,
        password: hash
      }))
      .then(() => res.redirect('/usrs/login'))
      .catch(err => console.log(err))
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
  req.flash('success_msg', '你已經成功登出。')
  res.redirect('/users/login')
})

module.exports = router