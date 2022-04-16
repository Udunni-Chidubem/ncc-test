
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
    let products = await adminController.getProducts(req, res);
    let approvedProducts=await products.filter(e => {
        return e.status == 1
    });
    let rejectedProducts = await products.filter(e=>{
        return e.status == 0
    })
    res.render('admin/product-mgt', {
        layout : 'admin-dashboard',
        title : 'Product Management',
        username : user.username,
        isVerified,
        products,
        approvedProducts,
        rejectedProducts
    })
});

adminRouter.get('/view-user/:user_id', async (req, res)=>{
    const user = await req.user
    let isVerified = await utils.isVerified(user)
    let farmer = await adminController.getOneFarmer(req, res);
    let company = await adminController.getOneCompany(req, res);
    let trader = await adminController.getOneTrader(req, res);
    let products = await adminController.getProductsByUserID(req, res);

    res.render('admin/view-user', {
        layout : 'admin-dashboard',
        title : 'All Users',
        sub_title : 'View User',
        prev_link : '/admin/all-users',
        username : user.username,
        isVerified,
        farmer,
        company,
        trader,
        products
    })
});

module.exports = adminRouter