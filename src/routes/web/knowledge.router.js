const knowledgeRouter=require('express').Router()
const utils = require('../../helpers/utils')



knowledgeRouter.get('/dashboard', async (req, res)=>{
    let user = await req.user
      
    
    res.render('knowlege_base/index', {
          
    })

})