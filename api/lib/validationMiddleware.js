const { validationResult } = require('express-validator/check')
const { handleAsync } = require('./helpers')
const { AppError, ErrorCode } = require('./error-handler')

const _parseValidationErrors = req => {
  const errorFormatter = ({ msg }) => {
    return ({
      error: msg,
      message: msg//req.t(msg)
    })
  }
  const err = validationResult(req)
    .formatWith(errorFormatter)

  return ({
    plainData: err,
    hasErrors: !err.isEmpty(),
    isEmpty: err.isEmpty(),
    mapped: () => {
      return err.mapped()
    },
    array: () => {
      return err.array()
    }
  })
}

exports.parseValidationErrors = _parseValidationErrors

const handleValidationErrors = req => {
  return _parseValidationErrors(req)
}

exports.handleValidationErrors = handleValidationErrors

exports.handleValidationMiddleware = handleAsync((req, res, next) => {
  const errors = handleValidationErrors(req)

  if (errors.hasErrors) {
    console.error(JSON.stringify(errors.mapped(), null, 4))
    throw new AppError(ErrorCode.VALIDATION_FAILED, { errors: errors.mapped() })
  } else {
    return next()
  }
})
