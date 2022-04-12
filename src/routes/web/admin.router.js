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
        username : user.username,
        isVerified
    })
});

adminRouter.get('/create-user', async (req, res)=>{
    let user = await req.user
    let roles =await adminController.getNascAdminRoles(req, res)
    console.log(user.username)
    let isVerified = await utils.isVerified(user)
    
    res.render('admin/create-user', {
        layout : 'admin-dashboard',
        title : 'User Management',
        sub_title : 'Create User',
        username : user.username,
        isVerified,
        roles : roles
    })
});


adminRouter.get('/all-users', async (req, res)=>{
    let user = await req.user
     let farmers=await adminController.getFarmers(req, res)
    let isVerified = await utils.isVerified(user)
    
    res.render('admin/all-users', {
        layout : 'admin-dashboard',
        title : 'All Users',
        username : user.username,
        isVerified,
        farmers
    })
});

adminRouter.get('/view-product', async (req, res)=>{
    let user = await req.user

    let isVerified = await utils.isVerified(user)
    
    res.render('admin/view-product', {
        layout : 'admin-dashboard',
        title : 'Product Management',
        sub_title : 'View Product',
        username : user.username,
        isVerified
    })
});



module.exports = adminRouter