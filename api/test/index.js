import express from 'express'

import { handleAsync } from '../lib/helpers'
import testController from './test.controller'

const router = express.Router()

router.get('/ping',
  handleAsync(testController.ping)
)

export default router
