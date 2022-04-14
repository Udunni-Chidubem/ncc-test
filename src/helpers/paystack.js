const { default: axios } = require('axios')
const uniqid = require('uniqid');
module.exports={
    callback:async (req, res)=>{
       let resp=await axios.get(process.env.paystack_verify+req.query.reference, {
            headers: {
                Authorization : 'Bearer '+process.env.paystack_secret_key
            }
        })
        return resp.data
    },
    initialize : async (email, amount, req)=>{
        try{
            let ref=uniqid()
             let resp=await axios.post(process.env.paystack_initialize, {
                    email : email,
                    amount : amount,
                    callback_url : req.get('origin')+'/farmer/checkout/callback',
                    key : process.env.paystack_secret_key,
                    reference : ref
                },
                {
                    headers: {
                        Authorization : 'Bearer '+process.env.paystack_secret_key
                    }
                }
            )
            console.log(resp.data.data.authorization_url)
           return resp.data
        }catch(e){
            console.log(e)
        }
    }
}
