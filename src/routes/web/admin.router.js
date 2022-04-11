const adminRouter=require('express').Router()
const siteController = require('../../controllers/site.controller');
const utils = require('../../helpers/utils')
const { adminValidation, validate, productValidation } = require('../../helpers/formValidator');
const adminController = require('../../controllers/admin.controller');

adminRouter.get('/dashboard', async (req, res)=>{
    let user = await req.user

    let isVerified = await utils.isVerified(user)
    
    res.render('admin/dashboard', {
        layout : 'admin-dashboard',
        title : 'Dashboard',
        isVerified
    })
});

<<<<<<< HEAD
adminRouter.get('/product-mgt', async (req, res)=>{
=======
adminRouter.get('/create-user', async (req, res)=>{
>>>>>>> 7ea4e04d08543867eab22daf4c9e334eea67ac51
    let user = await req.user

    let isVerified = await utils.isVerified(user)
    
<<<<<<< HEAD
    res.render('admin/product-mgt', {
        layout : 'admin-dashboard',
        title : 'Product Management',
=======
    res.render('admin/create-user', {
        layout : 'admin-dashboard',
        title : 'Dashboard',
>>>>>>> 7ea4e04d08543867eab22daf4c9e334eea67ac51
        isVerified
    })
});



module.exports = adminRouter