const _ = require('lodash')
const util = require('util')

const ErrorCode = Object.freeze({
  VALIDATION_FAILED: 'VALIDATION_FAILED',
  NOT_FOUND: 'NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  FORBIDDEN: 'FORBIDDEN',
  ECONNABORTED: 'ECONNABORTED',
  TIMEOUT: 'TIMEOUT'
})

class AppError {
  constructor(errorCode, options = {}) {
    this.errorCode = errorCode
    this.options = options
  }
}

function validationFailedResponse(err) {
  return {
    code: err.errorCode,
    errors: err.options.errors
  }
}

function notFoundResponse(err) {
  return {
    code: err.errorCode,
    message: err.options.message || err.message,
    errors: [
      {
        path: err.options.path
      }
    ]
  }
}

function unauthorizedResponse(err) {
  return {
    code: err.code,
    message: err.options.info,
    errors: [{
      path: err.options.path,
      info: err.options.info
    }]
  }
}

function internalServerErrorResponse(err) {
  return {
    code: err.errorCode,
    message: err.options.message,
    errors: [{
      message: err.options.message
    }]
  }
}

function forbiddenResponse(err) {
  return {
    code: err.errorCode,
    message: err.options.message,
    errors: [{
      message: err.options.message,
      path: err.options.path
    }]
  }
}

function timeoutErrorResponse(err) {
  return {
    code: err.errorCode,
    message: err.message
  }
}

function unknownErrorResponse(err) {
  return {
    code: 'UNKNOWN',
    errors: [{
      message: (process.env.NODE_ENV === 'development') ?
        util.inspect(err, false, null) : err.message
    }]
  }
}

const errorHandler = (err = {}, req = {}, res, next) => {
  console.error('Handling error.', util.inspect(err, false, null))

  const errorCode = err.errorCode || err.code
  err.code = errorCode
  err.errorCode = errorCode

  switch (errorCode) {
    case ErrorCode.VALIDATION_FAILED: {
      res.status(400)
      res.json(validationFailedResponse(err))
      break
    }
    case ErrorCode.UNAUTHORIZED: {
      res.status(401)
      res.json(unauthorizedResponse(err))
      break
    }
    case ErrorCode.FORBIDDEN: {
      res.status(403)
      res.json(forbiddenResponse(err))
      break
    }
    case ErrorCode.NOT_FOUND: {
      res.status(404)
      res.json(notFoundResponse(err))
      break
    }
    case ErrorCode.INTERNAL_SERVER_ERROR: {
      res.status(500)
      res.json(internalServerErrorResponse(err))
      break
    }
    case ErrorCode.TIMEOUT:
    case ErrorCode.ECONNABORTED:
      res.status(500)
      res.json(timeoutErrorResponse(err))
      break
    default: {
      console.error('Unknown error.', { error: err })
      res.status(err.status || _.get(err, 'options.status', 500))
      res.json(unknownErrorResponse(err))
    }
  }
}

module.exports = {
  errorHandler: errorHandler,
  AppError: AppError,
  ErrorCode: ErrorCode
}

