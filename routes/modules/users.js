const express = require('express')
const bcrypt = require('bcrypt')
const router = express.Router()
const User = require('../../models/user')

// 1. 導入註冊頁
router.get('/register', (req, res) => {
  res.render('register')
})

// 2. 註冊完成
router.post('/register', (req, res) => {
  const { name , email, password } = req.body
  console.log(name, email, password)
  res.render('/')
  User.findOne({ email }).then(user => {
    // 郵箱已經註冊
    if (user) {
      console.log('this email is already exist!')
    }
    // 未註冊的郵箱
    return bcrypt
      .genSalt(10) // 設定複雜度為10
      .then(salt => bcrypt.hash(password, salt)) // 密碼加鹽
      .then(hash => User.create({ // 密碼雜湊
        name,
        email,
        password: hash
      }))
      .then(() => res.redirect('/'))
      .catch(err => console.log(err))
  })
})


// 3. 導入登入頁
router.get('/login', (req, res) => {
  res.render('login')
})

// 4. 登入完成，導入餐廳頁面
router.post('/login', (req, res) => {
  const { email, password } = req.body
  console.log(email, password)
})

// 5. 登出

module.exports = router