const { validationResult } = require('express-validator');

/**
 * Middleware to handle validation errors from express-validator.
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next middleware function.
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({ msg: err.msg, param: err.path })),
    });
  }
  next();
};

module.exports = { handleValidationErrors };