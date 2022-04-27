const companyRouter=require('express').Router()
const siteController = require('../../controllers/site.controller');
const utils = require('../../helpers/utils')
const { companyValidation, validate, productValidation } = require('../../helpers/formValidator');
const companyController = require('../../controllers/company.controller');

companyRouter.get('/dashboard', async (req, res)=>{
    let user = await req.user
    let company = await utils.getCompanyProfile(user)
    let balance = await companyController.getWallet(req, res)
    let productCount = await companyController.getProductCount(req, res)

    let isVerified = await utils.isVerified(user)

    res.render('seed_company/dashboard', {
        layout : 'company-dashboard',
        title : 'Dashboard',
        company: company,
        page_title: '',
        isVerified,
        balance,
        productCount
    })
});


companyRouter.get('/update-profile', async (req, res)=>{
    let states = await siteController.getStates();
    let user = await req.user
    let isVerified = await utils.isVerified(user, 'company')
    let company = await utils.getCompanyProfile(user)
    res.render('seed_company/update-profile', {
        layout : 'company-dashboard',
        title : 'Profile Update',
        states : states,
        company: company,
        isVerified,
    })
});
/*Update Profile*/
companyRouter.post('/update-profile', companyValidation(), validate, async (req, res) => {
    let r = await companyController.updateProfile(req, res)

    if(r.company) {
        res.json({ message: 'Your profile has been “updated” successfully.', statusCode: 200 }).status(200)
    }else{
        res.json({ message: r.errors, error: true, statusCode: 400 }).status(400)
    }
    
});

/*Product Routes Begins*/

/*Create Product GET request*/
companyRouter.get('/products/create', async (req, res)=>{

    res.render('seed_company/create-products', {
        layout : 'company-dashboard',
        title : 'Create Product',
    })
});

/*Create Product POST request*/
companyRouter.post('/products/create', productValidation(), validate, async (req, res)=>{
    let filename='';
    if(req.files){
        let upload=req.files.upload
        filename=Date.now()+upload.name
        upload.mv('./public/product_images/'+filename)
    }
    let r = await companyController.createProduct(req, res, filename);
    if(r.id){
        res.json({statusCode:200, message: "Your Product has been created successfully", body :r}).status(200).send()
    }else{
        res.json({statusCode:500, error :r, message : "something went wrong"}).status(500).send();
    }
});

/*Update Product Logic*/
companyRouter.post('/products/update/:id', async (req, res)=>{
     companyController.updateProduct(req, res)
     res.json({statusCode : 200, message : "Product updated successfully", body : "Product updated succeessfully"}).status(200).send()

})


/*Product List*/
companyRouter.get('/products', async (req, res)=>{

    let product = await companyController.listProducts(req, res)
    let paginate
    if(product){
        paginate = { page: req.query.page || 1, pageCount: product.totalPages }
        // console.log(paginate);
    }
    console.log(paginate)
    res.render('seed_company/product-list', {
        layout : 'company-dashboard',
        product,
        pagination: paginate,
        title : 'Products',
    })
});



/*Update Product Page*/
companyRouter.get('/products/update/:id', async (req, res)=>{

    let product = await companyController.viewProduct(req, res)

    res.render('seed_company/update-product', {
        layout : 'company-dashboard',
        product,
        title : 'Products',
        sub_title: 'Update Product'
    })
});

/*View Product*/
companyRouter.get('/products/:id', async (req, res)=>{

    let product = await companyController.viewProduct(req, res)

    const data = JSON.stringify(JSON.parse(product.item))
    
    res.render('seed_company/view-product', {
        layout : 'company-dashboard',
        data,
        product,
        title : 'Products',
        sub_title : 'View Product',
        prev_link : '/seed-company/products'
    })
});
/*Product Routes Ends*/


/*Order Routes Begins*/

/*Order List*/
companyRouter.get('/orders', async (req, res)=>{
    let orders=null;
    product=null
    if(req.query.product){
        product=req.query.product
        orders=await companyController.getProductOrders(req, product)
    }else{
        orders=await companyController.getOrders(req, res)
    }
    res.render('seed_company/order-list', {
        layout : 'company-dashboard',
        title : 'Order List',
        orders,
    })
});

/*Order GET request*/
companyRouter.get('/orders/:transaction_id/', async (req, res)=>{
    let user = await req.user
    let isVerified = await utils.isVerified(user, 'company')
    let company = await utils.getCompanyProfile(user)
    let {order, farmer, orderStatus} = await companyController.getOrder(req.params.transaction_id, user.id, company.id)
    res.render('seed_company/view-order', {
        layout : 'company-dashboard',
        title : 'Orders',
        sub_title : 'View Order',
        order,
        farmer,
        orderStatus,
        prev_link : '/seed-company/orders',
        transaction_id : req.params.transaction_id
    })
});

/*Order POST request*/
companyRouter.post('/orders/:transaction_id/', async (req, res)=>{
    let user = await req.user
    let data={}
    data.status = req.body.status
    companyController.updadeOrders(req.body.order, data)
    let isVerified = await utils.isVerified(user, 'company')
    let company = await utils.getCompanyProfile(user)
    let {order, farmer, orderStatus} = await companyController.getOrder(req.params.transaction_id, user.id, company.id)
    
    
    res.render('seed_company/view-order', {
        layout : 'company-dashboard',
        title : 'Orders',
        sub_title : 'View Order',
        prev_link : '/admin/orders',
        order,
        farmer,
        orderStatus,
        transaction_id : req.params.transaction_id
    })
});

/*Order Count*/
companyRouter.get("/orders/count/company", async (req, res)=>{
    let user = await req.user
    let company = await utils.getCompanyProfile(user)
    let count = await companyController.getOrderCount(company.id)
    res.json({ message: count , statusCode: 200 }).status(200)
});

/*Order Routes End*/

/* Wallet */
companyRouter.get('/wallet', async (req, res)=>{
    let user = await req.user
    let isVerified = await utils.isVerified(user, 'company')
    let wallet = await companyController.getWallet(req, res)
    res.render('seed_company/wallet', {
        layout : 'company-dashboard',
        title : 'Wallet',
        wallet
    })
});

// companyRouter.get('/knowledge-base', (req,res) => {
//     res.render('knowledge_base', {
//         layout: '',
//         title : 'Knowledge Base - Index'
//     }); 
// })

module.exports=companyRouter