const jsonwebtoken=require('jsonwebtoken');
const db = require('../models/index');
function verityToken(req, res, next){
    try{
      if(req.header.Authorization==null){

      }
      if(req.get('Authorization')==null){
        res.send()
      }
      let token=req.get('Authorization').split(' ')[1]
        if(jsonwebtoken.verify(token, 'secret123')){
          let payload=jsonwebtoken.decode(token)
          if(payload.exp>=Date.now()){
            res.status(401).json({statusCode : 401, title : 'unauthorized', body : "Token has expired"}).send()
          }else{
            res.locals.user = payload
          }
        }else{
          res.status(401).json({statusCode : 401, error : e.message}).send()
        }
    }catch(e){
      res.status(401).json({statusCode : 401, error : e.message}).send()
    }
    return next()
}

module.exports=verityToken