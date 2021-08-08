// 判斷是否已經登入
// 登入後，進入下一階段
// 未登入，導入登入樣板
module.exports = {
  authenticator: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next()
    }
    req.flash('warning_msg', '請先登入')
    res.redirect('/users/login')
  }
}