const express = require('express')
const path = require('path')

import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'

const app = express()

import api from './api'
import { errorHandler } from './api/lib/error-handler'

// const passport = require('passport')
// require('./api/config/passport')

app.set('trust proxy', 1)

app.use(cookieParser())
app.use(bodyParser())

// Modules to store session
const session = require('express-session')
// const MySQLStore = require('express-mysql-session')(session)
const sessionStoreOptions = {
  host: process.env.DB_HOST,
  port: 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
}

// const sessionStore = new MySQLStore(sessionStoreOptions)

app.use(session({
  secret: process.env.SESSION_SECRET,
  key: process.env.SESSION_KEY,
  saveUninitialized: false,
  resave: false,
  cookie: {
    httpOnly: true,
    maxAge: 30 * 60 * 60 * 1000,
  },
  //resave: true,
  //store: sessionStore
}))

// app.use(passport.initialize())
// app.use(passport.session())

app.use((req, res, next) => {
  res.locals.user = req.user
  next()
})

// gzip
// app.use(compression())

//Static file declaration
// app.use(express.static(path.join(__dirname, 'client/build')))

// //Route setup
// app.get('/', (req, res) => {
//   res.send('root route')
// })

// Mount the REST API
app.use('/api', api)


app.use((err, req, res, next) => {
  errorHandler(err, req, res, next)
})


//Static file declaration
app.use('/upload', express.static(path.join(__dirname, 'public/uploads')))
app.use(express.static(path.join(__dirname, 'client/build')))


// production mode
if (process.env.NODE_ENV === 'production') {
  console.log('==== production mode =====')
  
  app.use(express.static(path.join(__dirname, 'client/build')))
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + 'client/build/index2.html'))
  })
} else {
  //build mode
  console.log('==== development mode =====')
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/public/index.html'))
  })
}
//TODO: replace the above with .static()
//app.use(express.static('./client/public'))

module.exports = app
