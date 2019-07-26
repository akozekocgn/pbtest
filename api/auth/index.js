import express from 'express'
import passport from 'passport'

const env = process.env.NODE_ENV || 'production';

const router = express.Router()

router.get('/facebook',
  passport.authenticate('facebook', {
    scope: ['email'] // 'user_friends' scope is temporary excluded
  })
)

router.get('/facebook/callback',
  passport.authenticate('facebook', {
    failureRedirect: '/login',
    session: true
  }),
  function(req, res) {
    console.log(env)
    const redirectUrl = env === 'development' ? 'http://localhost:3000/explore' : '/explore'
    console.log(redirectUrl)
    return res.redirect(redirectUrl)
  }
)

router.get('/logout', function(req, res) {
  req.logout()
  res.redirect('/')
})

export default router
