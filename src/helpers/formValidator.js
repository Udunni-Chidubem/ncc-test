const { body, validationResult } = require('express-validator')
const db = require('../models')
const { SeedCompany } = db


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

const companyValidation = () => {
    return [
        body('name_of_company')
            .not().isEmpty().withMessage('Company Name field is required'),
        body('phone_no')
            .not().isEmpty().withMessage('Phone Number field is required'),
        body('tin')
            .not().isEmpty().withMessage('TIN field is required'),
        body('address')
            .not().isEmpty().withMessage('Address field is required'),
        body('licensed_no')
            .not().isEmpty().withMessage('Licensed Number field required'),
        body('certification_number')
            .not().isEmpty().withMessage('Certification Number field is required'),
        body('email')
            .not().isEmpty().withMessage('Email field is required'),
            // .custom((value, { req }) => {
            //     return SeedCompany.findOne({ where: { email: req.body.email } }).then(user => {
            //         if (user) {
            //             return Promise.reject('E-mail address already in use. Please try another one');
            //         }
            //     });
            // }),
        body('state_id')
            .not().isEmpty().withMessage('State field is required'),
        body('lg_id')
            .not().isEmpty().withMessage('LGA field is required'),
        
    ];
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
    companyValidation,
    validate
}