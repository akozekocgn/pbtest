import express from 'express'
import helmet from 'helmet'
import bodyParser from 'body-parser'

import test from './test'
// import auth from './auth'
// import user from './user'
// import events from './events'

const Api = express()

Api.use(helmet())
Api.use(helmet.hidePoweredBy())

// // always send JSON headers
// Api.use((req, res, next) => {
//   res.contentType('application/json')
//   next()
// })

// parse JSON body
Api.use(bodyParser.json())

// Add all API endpoints here
Api.use('/test', test)
// Api.use('/auth', auth)
// Api.use('/events', events)
// Api.use('/users', user)
// Api.use('/api/profile', auth)

export default Api
