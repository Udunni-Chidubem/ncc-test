const { body, validationResult } = require('express-validator')
const db = require('../models')


const profileUpdateValidation = () => {

}

const validate = (req, res, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        return next()
    }
    const extractedErrors = []
    errors.array().map(err => extractedErrors.push({ msg: err.msg }))

    res.json({
        statusCode: 402,
        error: true,
        data: extractedErrors
    })
}

module.exports = {
    profileUpdateValidation,
    validate
}