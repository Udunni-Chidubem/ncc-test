const db = require('../models');
const {User, UserRole, Role }  = db
const bcrypt = require('bcrypt');
const { raw } = require('body-parser');


const seedAdminData = async () => {
	let transaction = await db.rest.transaction();
	const password = await bcrypt.hash("P@ssw0rd@1", 10)
	try{
		let user = User.findOne(
			{
				where : {username : 'admin'}
			}
		);
		if(!user){
			user = await User.create({
				username: "admin",
				password : password,
				status : 1
			}, {transaction : transaction})

			if(user){
				let r = await Role.findOne(
					{
						where : { role_name : 'admin' },
						raw: true
					}
				);

				console.log(r)
				if(!r){
					r = await Role.create({role_name : 'admin'}, {transaction : transaction})
				}
				if(r) {
					const rolee = UserRole.create({user_id : user.id, role_id : r.id})
					console.log(rolee + 121)
				}
			}
			transaction.commit();
		}
	}catch(e){
		transaction.rollback();
		console.log(e)
	}


}

module.exports = {seedAdminData}