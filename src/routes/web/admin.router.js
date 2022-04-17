
const adminRouter=require('express').Router()
const siteController = require('../../controllers/site.controller');
const utils = require('../../helpers/utils')
const { adminValidation, validate, productValidation } = require('../../helpers/formValidator');
const adminController = require('../../controllers/admin.controller');
const { now } = require('moment');

adminRouter.get('/dashboard', async (req, res)=>{
    let user = await req.user
    let isVerified = await utils.isVerified(user)
    let farmerCount = await adminController.getFarmerCount(req, res)
    let companyCount = await adminController.getCompanyCount(req, res)

    res.render('admin/dashboard', {
        layout : 'admin-dashboard',
        title : 'Dashboard',
        username : user.username,
        isVerified,
        farmerCount,
        companyCount
    })
});

adminRouter.get('/user/create', async (req, res)=>{
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


adminRouter.get('/users', async (req, res)=>{
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

adminRouter.get('/products/:id', async (req, res)=>{
    let user = await req.user
    let isVerified = await utils.isVerified(user);
    let product = await adminController.viewProduct(req, res);

    
    res.render('admin/view-product', {
        layout : 'admin-dashboard',
        title : 'Product Management',
        sub_title : 'View Product',
        prev_link: '/admin/products',
        username : user.username,
        isVerified,
        product
    })
});

adminRouter.get('/products', async (req, res)=>{
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

adminRouter.get('/users/:user_id', async (req, res)=>{
    const user = await req.user
    let isVerified = await utils.isVerified(user)
    let farmer = await adminController.getOneFarmer(req, res);
    let company = await adminController.getOneCompany(req, res);
    let trader = await adminController.getOneTrader(req, res);
    let products = await adminController.getProductsByUserID(req, res);
    let balance = await adminController.getWallet(req, res);

    res.render('admin/view-user', {
        layout : 'admin-dashboard',
        title : 'All Users',
        sub_title : 'View User',
        prev_link : '/admin/users',
        username : user.username,
        isVerified,
        farmer,
        company,
        trader,
        products,
        balance
    })
});
adminRouter.get('/products/approval/:id/:status', async (req, res)=>{
    let data={status : req.params.status, updated_at : now()}
    let id = req.params.id
    adminController.productUpdate(data, id)
    res.redirect("/admin/products")
})
adminRouter.get("/users/activate/:id/:status", async (req, res)=>{
     let data={status : req.params.status, updated_at : now()}
    let id = req.params.id
    adminController.userUpdate(data, id)
    res.redirect("/admin/users")
})


module.exports = adminRouter