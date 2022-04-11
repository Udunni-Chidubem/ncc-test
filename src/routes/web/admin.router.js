// const adminRouter=require('express').Router()
// const siteController = require('../../controllers/site.controller');
// const utils = require('../../helpers/utils')
// const { adminValidation, validate, productValidation } = require('../../helpers/formValidator');
// const adminController = require('../../controllers/admin.controller');

// adminRouter.get('/dashboard', async (req, res)=>{
//     let user = await req.user

//     let isVerified = await utils.isVerified(user)
    
//     res.render('admin/dashboard', {
//         layout : 'admin-dashboard',
//         title : 'Dashboard',
//         isVerified
//     })
// });

// adminRouter.get('/create-user', async (req, res)=>{
//     let user = await req.user

//     let isVerified = await utils.isVerified(user)
    
//     res.render('admin/product-mgt', {
//         layout : 'admin-dashboard',
//         title : 'Product Management',
//     },
//     res.render('admin/create-user', {
//         layout : 'admin-dashboard',
//         title : 'Dashboard',

//         isVerified
//     })
// });



// module.exports = adminRouter

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
adminRouter.get('/create-user', async (req, res)=>{
    let user = await req.user
    let isVerified = await utils.isVerified(user)
    res.render('admin/create-user', {
        layout : 'admin-dashboard',
        title : 'Dashboard',
        isVerified
    })
});
adminRouter.get('/product-mgt', async (req, res)=>{
    let user = await req.user
    let isVerified = await utils.isVerified(user)
    res.render('admin/product-mgt', {
        layout : 'admin-dashboard',
        title : 'Product Management',
        isVerified
    })
});
module.exports = adminRouter