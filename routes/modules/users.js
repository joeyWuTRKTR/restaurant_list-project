const express = require('express')
const router = express.Router()

// 1. 導入註冊頁
router.get('/register', (req, res) => {
  res.render('register')
})

// 2. 註冊完成

// 3. 導入登入頁
router.get('/login', (req, res) => {
  res.render('login')
})

// 4. 登入完成，導入餐廳頁面

// 5. 登出

module.exports = router