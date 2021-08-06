const express = require('express')
const router = express.Router()
const User = require('../../models/user')

// 1. 導入註冊頁
router.get('/register', (req, res) => {
  res.render('register')
})

// 2. 註冊完成
router.post('/register', (req, res) => {
  const { user , email, password } = req.body
  console.log(user, email, password)
})


// 3. 導入登入頁
router.get('/login', (req, res) => {
  res.render('login')
})

// 4. 登入完成，導入餐廳頁面

// 5. 登出

module.exports = router