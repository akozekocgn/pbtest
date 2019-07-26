import { handleAsync } from '../lib/helpers'
import { AppError, ErrorCode } from '../lib/error-handler'

/**
 * Authentification middleware.
 */

export default handleAsync((req, res, next) => {
  const isAuthenticated = req.isAuthenticated()
  if (!isAuthenticated) {
    throw new AppError(ErrorCode.UNAUTHORIZED, {
      message: 'Unauthorized',
      path: req.path
    })
  }
  return next()
})
