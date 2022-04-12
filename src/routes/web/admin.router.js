
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
    let isVerified = await utils.isVerified(user)

    res.render('admin/create-user', {
        layout : 'admin-dashboard',
        title : 'User Management',
        sub_title : 'Create User',
        username : user.username,
        prev_link: '/admin/all-users',
        isVerified,
        roles : roles
    })
});


adminRouter.get('/all-users', async (req, res)=>{
    let user = await req.user
    let farmers=await adminController.getFarmers(req, res)
    let traders = await adminController.getTraders(req, res)
    let companies= await adminController.getCompanies(req, res)
    let isVerified = await utils.isVerified(user)


    
    res.render('admin/all-users', {
        layout : 'admin-dashboard',
        title : 'User Management',
        sub_title : 'All Users',
        username : user.username,
        isVerified,
        farmers,
        companies,
        traders
    })
});

adminRouter.get('/view-product', async (req, res)=>{
    let user = await req.user
    let isVerified = await utils.isVerified(user)
    
    res.render('admin/view-product', {
        layout : 'admin-dashboard',
        title : 'Product Management',
        sub_title : 'View Product',
        prev_link: '/admin/product-mgt',
        username : user.username,
        isVerified
    })
});

adminRouter.get('/product-mgt', async (req, res)=>{
    let user = await req.user
    let isVerified = await utils.isVerified(user)

    res.render('admin/product-mgt', {
        layout : 'admin-dashboard',
        title : 'Product Management',
        username : user.username,
        isVerified
    })
});

adminRouter.get('/view-user/:id', async (req, res)=>{
    let user = await req.user
    let farmer=await adminController.viewFarmer(req, res)
    // let traders = await adminController.getTraders(req, res)
    // let companies= await adminController.getCompanies(req, res)
    let isVerified = await utils.isVerified(user)

    
    
    res.render('admin/view-user', {
        layout : 'admin-dashboard',
        title : 'View User',
        sub_title : 'View User',
        prev_link : '/admin/all-users',
        username : user.username,
        isVerified,
        farmer
        // companies,
        // traders
    })
});

module.exports = adminRouter