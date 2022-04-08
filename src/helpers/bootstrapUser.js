const db = require('../models');
const {User, UserRole, Role }  = db
const bcrypt = require('bcrypt');
const { raw } = require('body-parser');


const seedAdminData = async () => {

	const password = await bcrypt.hash("P@ssw0rd@1", 10)

	const user = await User.create({
        username: "admin",
        password : password,
        status : 1
    })

        if(user){
        	let r = await Role.findOne(
		        {
		            where : { role_name : 'admin' },
		            raw: true
		        }
		    );

		    console.log(r)

		    if(r) {
		    	const rolee = UserRole.create({user_id : user.id, role_id : r.id})
		    	console.log(rolee + 121)
		    }
        }
    

}

module.exports = {seedAdminData}