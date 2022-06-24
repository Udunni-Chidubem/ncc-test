
const reader=require('xlsx')
const siteController = require('../controllers/site.controller')
const db = require('../models/index');
const [User]=db
module.exports={
    farmer: ()=>{
        let file=reader.readFile('public/files/farmers.xlsx')
      //  let data = []
        const sheets = file.SheetNames
     
        for(let i = 0; i < sheets.length; i++)
        {
            const temp = reader.utils.sheet_to_json(
                file.Sheets[file.SheetNames[i]])
            temp.forEach((res) => {
                let count=await User.count({
                    where : {username : res.phone}
                })
                if(count<1){
                     let names=res.name.split(' ');
                    let rq={}
                    let rs={}
                    rq.body={}
                    rq.body.firstname=names[0];
                    rq.body.lastname=names[1]
                    rq.body.phone_number=res.phone
                    rq.body.password=res.password
                    console.log(rq)
                    siteController.savefarmer(rq, rs)
                }
               
            })
        }


        
      
    }
}