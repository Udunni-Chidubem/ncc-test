
const adminRouter=require('express').Router()
const siteController = require('../../controllers/site.controller');
const utils = require('../../helpers/utils')
const { adminValidation, validate, productValidation } = require('../../helpers/formValidator');
const adminController = require('../../controllers/admin.controller');
const { now } = require('moment');
const companyController = require('../../controllers/company.controller');
const { UserConversationList } = require('twilio/lib/rest/conversations/v1/user/userConversation');

adminRouter.get('/dashboard', async (req, res)=>{
    let user = await req.user
    let isVerified = await utils.isVerified(user)
    let farmerCount = await adminController.getFarmerCount(req, res)
    let companyCount = await adminController.getCompanyCount(req, res)
    let {activeProduct, inactiveProduct} = await adminController.getProductStatus(req,res)
    let {farmerinactivelist,farmeractivelist,seedcompanyactivelist,seedcompanyinactivelist,
        seedtraderactivelist,seedtraderinactivelist}= await adminController.getUserslist(req, res)
    let seedtraderCount = await adminController.getSeedTraderCount(req, res)
    let user_status = await adminController.getUserStatus(req, res)
    let user_role = await adminController.getUserRole(req, res)

    console.log(user_role.Role.role_name)


    res.render('admin/dashboard', {
        layout : 'admin-dashboard',
        title : 'Dashboard',
        username : user.username,
        isVerified,
        farmerCount,
        companyCount,
        seedtraderCount,
        farmerinactivelist,
        farmeractivelist,
        seedcompanyactivelist,
        seedcompanyinactivelist,
        seedtraderactivelist,
        seedtraderinactivelist,
        activeProduct,
        inactiveProduct,
        user_status: JSON.stringify(user_status),
        user_role: user_role.Role.role_name
    })
});

adminRouter.get('/users/create', async (req, res)=>{
    let user = await req.user
    let roles =await adminController.getNascAdminRoles(req, res)
    let isVerified = await utils.isVerified(user)
    let user_role = await adminController.getUserRole(req, res)


    res.render('admin/create-user', {
        layout : 'admin-dashboard',
        title : 'User Management',
        sub_title : 'Create User',
        username : user.username,
        prev_link: '/admin/all-users',
        isVerified,
        roles : roles,
        user_role: user_role.Role.role_name
    })
});
adminRouter.get('/messages', async (req, res)=>{
    let user = await req.user
    let roles =await adminController.getNascAdminRoles(req, res)
    let isVerified = await utils.isVerified(user)
    let user_role = await adminController.getUserRole(req, res)
    let getMessages = await adminController.getMessages(req, res)
    let getNewmessages = await adminController.getNewmessages(req, res)
    // let {messages,to_userid} = await adminController.getmessages(req, res)


    res.render('admin/messages', {
        layout : 'admin-dashboard',
        title : 'View Messages',
        username : user.username,
        isVerified,
        roles : roles,
        user_role: user_role.Role.role_name,
        getMessages,
        getNewmessages,
    })
});

adminRouter.get('/message_test', async (req, res)=>{
    let user = await req.user
    let roles =await adminController.getNascAdminRoles(req, res)
    let isVerified = await utils.isVerified(user)
    let user_role = await adminController.getUserRole(req, res)
    let getMessages = await adminController.getMessages(req, res)
    let getNewmessages = await adminController.getNewmessages(req, res)
    // let {messages,to_userid} = await adminController.getmessages(req, res)


    res.render('admin/message_test', {
        layout : 'admin-dashboard',
        title : 'View Messages',
        username : user.username,
        isVerified,
        roles : roles,
        user_role: user_role.Role.role_name,
        getMessages,
        getNewmessages,
    })
});

adminRouter.get('/view_message/:user_id', async (req, res)=>{
    let user = await req.user
    let roles =await adminController.getNascAdminRoles(req, res)
    let isVerified = await utils.isVerified(user)
    let user_role = await adminController.getUserRole(req, res)
    let {messages,to_userid} = await adminController.getmessages(req, res)
    let updateMessagestatus = await adminController.updateMessagestatus(req, to_userid)
    let getuserrole = await adminController.getuserrole(req, to_userid)
    let role_id = getuserrole.messages.UserRole.role_id
    let getuserdata = await adminController.getuserdata(role_id, to_userid)
    console.log(getuserdata)

    let user_id = user.id
    
    res.render('admin/view-message', {
        layout : 'admin-dashboard',
        title : 'View Message',
        isVerified,
        user_role: user_role.Role.role_name,
        messages,
        user_id,
        to_userid,
        getuserdata,
        role_id
    })
})
adminRouter.post('/message', async (req, res)=>{
    let user = await req.user
    let user_id = user.id
    let response = await adminController.message(req,user_id)
    res.json({ message: response }).status(200)
})
adminRouter.get('/getmessagescount', async (req, res) => {
    let user = await req.user
    let getmessagescount = await adminController.getmessagescount(req,res)
    getmessagescount = getmessagescount.length
        res.json({ message: getmessagescount }).status(200)

})
adminRouter.get('/users', async (req, res)=>{
    let user = await req.user
    let farmers=await adminController.getFarmers(req, res)
    let traders = await adminController.getTraders(req, res)
    let companies= await adminController.getCompanies(req, res)
    let isVerified = await utils.isVerified(user)
    let user_role = await adminController.getUserRole(req, res)

    res.render('admin/all-users', {
        layout : 'admin-dashboard',
        title : 'User Management',
        sub_title : 'All Users',
        username : user.username,
        isVerified,
        farmers,
        companies,
        traders,
        user_role: user_role.Role.role_name
    })
});

adminRouter.get('/products/:id', async (req, res)=>{
    let user = await req.user
    let isVerified = await utils.isVerified(user);
    let product = await adminController.viewProduct(req, res);
    let user_role = await adminController.getUserRole(req, res)
    console.log(product)
    
    res.render('admin/view-product', {
        layout : 'admin-dashboard',
        title : 'Product Management',
        sub_title : 'View Product',
        prev_link: '/admin/products',
        username : user.username,
        isVerified,
        product,
        user_role: user_role.Role.role_name
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
    });
    let revokedProducts = await products.filter(e=>{
        return e.status == 2
    })
    let user_role = await adminController.getUserRole(req, res)


    res.render('admin/product-mgt', {
        layout : 'admin-dashboard',
        title : 'Product Management',
        username : user.username,
        isVerified,
        products,
        approvedProducts,
        rejectedProducts,
        revokedProducts,
        user_role: user_role.Role.role_name
    })
});

adminRouter.get('/users/:id', async (req, res)=>{
    let type=req.query.type
    const user = await req.user
    let isVerified = await utils.isVerified(user)
    let farmer=null, company=null, trader=null, products=null, balance=null;
    if(type=="farmer")
        farmer = await adminController.getOneFarmer(req, res);
    if(type=="company"){
        company = await adminController.getOneCompany(req, res);
        products = await adminController.getProductsByUserID(req, res);
    }
    if(type=="trader")
        trader = await adminController.getOneTrader(req, res);
    
    balance = await adminController.getWallet(req, res);
    let user_role = await adminController.getUserRole(req, res)


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
        balance,
        user_role: user_role.Role.role_name
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


/*Orders Route Begins*/
adminRouter.get("/orders", async (req, res)=>{
    let user = await req.user
    let isVerified = await utils.isVerified(user)
    let orders = await adminController.getOrders(res, req)
    
    let pendingOrders = await orders.filter(e=>{
        return e.status == 0
    });
    
    let activeOrders=await orders.filter(e => {
        return e.status == 1
    });

    let shippedOrders=await orders.filter(e => {
        return e.status == 2
    });

    let hubOrders = await orders.filter(e=>{
        return e.status == 3
    })
    
    let fulfilledOrders = await orders.filter(e=>{
        return e.status == 4
    })
    let user_role = await adminController.getUserRole(req, res)

    
    res.render('admin/orders', {
        layout : 'admin-dashboard',
        title : 'Orders',
        username : user.username,
        isVerified,
        orders,
        pendingOrders,
        activeOrders,
        shippedOrders,
        fulfilledOrders,
        user_role: user_role.Role.role_name
    })
})

adminRouter.get('/orders/:id/:transaction_id/:company_id', async (req, res)=>{
    let user = await req.user
    let isVerified = await utils.isVerified(user);
    // company_name = req.params.company_name;
    // let company = await utils.getCompanyProfile(user)
    transaction_id = req.params.transaction_id;
    let user_role = await adminController.getUserRole(req, res)


    let {order, farmer, orderStatus} = await adminController.getOrder(req.params.transaction_id, req.params.id, req.params.company_id)
    res.render('admin/order-view', {
        layout : 'admin-dashboard',
        title : 'Order View',
        order,
        farmer,
        orderStatus,
        username : user.username,
        isVerified,
        transaction_id: transaction_id,
        user_role: user_role.Role.role_name
    })
});

/*Order POST request*/
adminRouter.post('/orders/:id/:transaction_id/:company_id', async (req, res)=>{
    let user = await req.user
    let data={}
    data.status = req.body.status
    adminController.updadeOrders(req.body.order, data)
    let {order, farmer, orderStatus} = await adminController.getOrder(req.params.transaction_id, req.params.id, req.params.company_id)
    
    
    res.redirect("/admin/orders")
});

adminRouter.get('/user_report', async (req,res)=>{
    let user = await req.user
    let isVerified = await utils.isVerified(user);
    let user_role = await adminController.getUserRole(req, res)
   
    res.render('admin/user_report', {
        layout : 'admin-dashboard',
        title : 'User-Report',
        username : user.username,
        isVerified,  
        user_role: user_role.Role.role_name
    })
    
});

adminRouter.get('/transactions', async (req,res)=>{
    let user = await req.user
    let isVerified = await utils.isVerified(user);
    let user_role = await adminController.getUserRole(req, res)

    res.render('admin/transactions', {
        layout : 'admin-dashboard',
        title : 'Transaction-Report',
        username : user.username,
        isVerified,  
        user_role: user_role.Role.role_name
    })
});

module.exports = adminRouter