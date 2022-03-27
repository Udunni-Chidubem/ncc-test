const { body, validationResult } = require('express-validator')
const db = require('../models')
const { SeedCompany, User, SeedTrader } = db


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
        body('state_id')
            .not().isEmpty().withMessage('State field is required'),
        body('lg_id')
            .not().isEmpty().withMessage('LGA field is required'),
        
    ];
}

const signupValidation = () => {
    return [
        body('firstname')
            .not().isEmpty().withMessage('Firstname field is required'),
        body('lastname')
            .not().isEmpty().withMessage('Lastname field is required'),
        body('phone_number')
            .not().isEmpty().withMessage('Phone Number field is required')
            .custom((value, { req }) => {
                return User.findOne({ where: { username: req.body.phone_number } }).then(user => {
                    if (user) {
                        return Promise.reject('Phone Number is already in use. Please try another one!');
                    }
                });
            }),
        body('password')
            .not().isEmpty().withMessage('Password field is required'),
        body('confirm_password')
            .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Password confirmation does not match Password');
            }
            return true
        })
    ];
}

const signUpvalidate = (req, res, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        return next()
    }
    const extractedErrors = []
    errors.array().map(err => extractedErrors.push({ msg: err.msg }))


    //Send Values Back to form
    let formData = {
        firstname: req.body.firstName,
        lastname: req.body.lastName,
        phone_number: req.body.phone_number
    }

    res.render('farmer_signup',{
        form_banner:'Group.png',
        layout : 'form',
        formData,
        extractedErrors,
        title : 'Farmer\'s Registration',
    });
}

const registerSeedCompanyValidation = () => {
    return [
        body('company_name')
            .not().isEmpty().withMessage('Company\'s Name field is required'),
        body('phone')
            .not().isEmpty().withMessage('Phone Number field is required')
            .custom((value, { req }) => {
                return User.findOne({ where: { username: req.body.phone } }).then(user => {
                    if (user) {
                        return Promise.reject('Phone Number is already in use. Please try another one!');
                    }
                });
            }),
        body('password')
            .not().isEmpty().withMessage('Password field is required'),
        body('confirm_password')
            .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Password confirmation does not match Password');
            }
            return true
        })
    ];
}

const registerSeedCompanyValidate = (req, res, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        return next()
    }
    const extractedErrors = []
    errors.array().map(err => extractedErrors.push({ msg: err.msg }))


    //Send Values Back to form
    let formData = {
        company_name: req.body.company_name,
        phone: req.body.phone
    }

    res.render('seed_company_signup',{
        form_banner:'seeds-02 1.png',
        layout : 'form',
        title: 'Seed\'s Company Registration',
        formData,
        extractedErrors,
    });
}

const seedTraderValidation = () => {
    return [
        body('firstname')
            .not().isEmpty().withMessage('Firstname field is required'),
        body('lastname')
            .not().isEmpty().withMessage('Lastname field is required'),
        body('phone')
            .not().isEmpty().withMessage('Phone Number field is required')
            .custom((value, { req }) => {
                return User.findOne({ where: { username: req.body.phone } }).then(user => {
                    if (user) {
                        return Promise.reject('Phone Number is already in use. Please try another one!');
                    }
                });
            }),
        body('password')
            .not().isEmpty().withMessage('Password field is required'),
        body('confirm_password')
            .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Password confirmation does not match Password');
            }
            return true
        })
    ];
}

const seedTraderValidate = (req, res, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        return next()
    }
    const extractedErrors = []
    errors.array().map(err => extractedErrors.push({ msg: err.msg }))


    //Send Values Back to form
    let formData = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        phone: req.body.phone
    }

    res.render('seed_trader_signup',{
        form_banner:'tradersignup.png',
        layout : 'form',
        title: 'Seed\'s Trader Registration',
        formData,
        extractedErrors,
    });
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
    companyValidation,
    validate,
    signupValidation,
    signUpvalidate,
    registerSeedCompanyValidation,
    registerSeedCompanyValidate,
    seedTraderValidation,
    seedTraderValidate
}