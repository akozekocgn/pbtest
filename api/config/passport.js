import passport from 'passport'
import FacebookStrategy from 'passport-facebook'
import _ from 'lodash'
import {
  User
} from '../models'

const env = process.env.NODE_ENV || 'production';
const callbackUrlPrefix = (env === 'development') ? 'http://localhost:5000' : 'https://www.okgo.ml'

passport.serializeUser(function(user, done) {
  done(null, user.id)
});

passport.deserializeUser(async function(id, done) {
  const user = await User.findByPk(id)
  done(null, user.toJSON())
})


passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: callbackUrlPrefix + "/api/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'name', 'gender', 'picture.type(large)']
  }, function(accessToken, refreshToken, profile, cb) {
    console.log('accessToken', accessToken)
    console.log('refreshToken', refreshToken)
    console.log('profile', profile)
    console.log('cb', cb)
    User.findOrCreate({ where: { facebook_id: profile.id }, defaults: { name: profile.displayName } })
      .then((users, err ) => {
        let user = users[0]
        const userpic = _.get(profile, 'photos[0].value')
        if (!user.userpic && userpic) {
          user.userpic = userpic
          user.save()
          .then(user => user.reload().then(() => {
            console.log('user', user.toJSON())
            console.log('err', err)
            return cb(err, user.toJSON())
          }))
        } else {
          console.log('user', user)
          console.log('err', err)
          return cb(err, user.toJSON())
        }

      })
  }
))
