import express from 'express'

import { handleAsync } from '../lib/helpers'
import userController from './user.controller'
import isAuthenticated from '../middlewares/isAuthenticated'

const router = express.Router()

router.get('/profile',
  isAuthenticated,
  handleAsync(userController.getProfile)
)

router.get('/profile/:id',
  isAuthenticated,
  handleAsync(userController.getProfile)
)

router.put('/profile/:id',
  isAuthenticated,
  handleAsync(userController.setProfile)
)

router.get('/preferences',
  isAuthenticated,
  handleAsync(userController.getPreferences)
)

router.put('/preferences',
  isAuthenticated,
  handleAsync(userController.setPreferences)
)

router.post('/event',
  isAuthenticated,
  handleAsync(userController.createUserEvent)
)

export default router
