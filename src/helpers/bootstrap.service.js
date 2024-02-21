const userUpload = require("./user.upload");
if(process.env.bootstrap_farmers==1){
    userUpload.farmer()
}

