const { body, validationResult } = require('express-validator')
const db = require('../models')


const profileUpdateValidation = () => {
    return [
        body('firstname')
            .not().isEmpty().withMessage('Firstname field is required'),
        body('lastname')
            .not().isEmpty().withMessage('Lastname field is required'),
        body('gender')
            .not().isEmpty().withMessage('Gender field is required'),
        body('level_of_education')
            .not().isEmpty().withMessage('Education Level field is required'),
        body('state_id')
            .not().isEmpty().withMessage('State field is required'),
        body('lg_id')
            .not().isEmpty().withMessage('LGA field is required'),
        body('state_of_delivery')
            .not().isEmpty().withMessage('State of Delivery field is required'),
        body('lga_of_delivery')
            .not().isEmpty().withMessage('LGA of Delivery field is required'),
        body('address')
            .not().isEmpty().withMessage('Address field is required')
        
   ] 
}

const validate = (req, res, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        return next()
    }
    const extractedErrors = []
    errors.array().map(err => extractedErrors.push({ msg: err.msg }))

    // console.log(extractedErrors)

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