const jsonwebtoken=require('jsonwebtoken')
function verityToken(req, res){
    let token=req.get('Authorization').split(' ')[1]
    let payload=jsonwebtoken.decode(token)
  //  let user = await User 
    return req
}

module.exports=verityToken