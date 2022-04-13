const { default: axios } = require('axios')
const uniqueString = require('unique-string')
const uniqid = require('uniqid');
module.exports={
    callback:async (req, res)=>{
       let resp=await axios.get('https://api.paystack.co/transaction/verify/'+req.query.reference, {
            headers: {
                Authorization : 'Bearer '+process.env.paystack_test_secret_key
            }
        })
        res.send(resp.data)
    },
    initialize : async (email, amount)=>{
        try{
            let ref=uniqid()
             let resp=await axios.post(process.env.paystack_initialize, {
                    email : email,
                    amount : amount,
                    callback_url : window.location.origin+'/checkout/callback',
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

        }
    }
}
