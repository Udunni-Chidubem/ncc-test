const db = require('../models');
const { QueryTypes } = require("sequelize")
const {User, UserRole, Role, SeedCompany, Wallet, Orders }  = db
const bcrypt = require('bcrypt');
const { raw } = require('body-parser');


const seedAdminData = async () => {
	let transaction = await db.rest.transaction();
	const password = await bcrypt.hash("P@ssw0rd@1", 10)
	try{
		let user =await User.findOne(
			{
				where : {username : 'admin'},
				raw : true
			}
		);
		let rraUser =await User.findOne(
			{
				where : {username : 'isusman@mercycorps.org'},
				raw : true
			}
		);
		let s = await SeedCompany.findAll({
			attributes : ['user_id']
		});
		s.forEach(async e=>{
			let w = await Wallet.findOne({where : { user_id :e.user_id }})
			if(!w){
				Wallet.upsert({
					user_id : e.user_id,
					amount : 0
				})
			}
		})
		let sql = "SELECT DISTINCT s.id as company_id, tl.id as t_id FROM transaction_log tl join transaction_carts tc on tl.id = tc.transaction_log_id "
			+"join cart c on c.id = tc.cart_id join product p on p.id = c.product_id join seedcompany s on s.user_id = p.user_id"
		let  t = await db.rest.query(sql, {type : QueryTypes.SELECT })
		t.forEach(async e => {
			let o = await Orders.findOne({where : {company_id : e.company_id}})
			if(!o){
				await Orders.create({
					company_id:e.company_id,
					transaction_log_id:e.t_id,
				})
			}
		})
	//	console.log(user)
		let f = await Role.findOne({
			where : {role_name : 'farmer'}
		})
		
		if(!f){
			await Role.create({
				role_name : 'farmer'
			}, {transaction : transaction});
		}

		let sc = await Role.findOne({
			where : {role_name : 'seed_company'}
		})
		
		if(!sc){
			await Role.create({
				role_name : 'seed_company'
			}, {transaction : transaction});
		}

		let st = await Role.findOne({
			where : {role_name : 'seed_trader'}
		})
		
		if(!st){
			await Role.create({
				role_name : 'seed_trader'
			}, {transaction : transaction});
		}


		
			
		if(user==null){
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
		}
		
		if(rraUser==null){
			rraUser = await User.create({
				username: "kalufe@mercycorps.org",
				password : password,
				status : 1
			}, {transaction : transaction})

			if(rraUser){
				let rr = await Role.findOne({
					where : {role_name : 'rra'}
				})
				
				if(!rr){
					await Role.create({
						role_name : 'rra'
					}, {transaction : transaction});
				}
				if(rr) {
					const roler = UserRole.create({user_id : rraUser.id, role_id : rr.id})
					console.log(roler + 123)
				}
			}
		}

		let n = await Role.findOne({
			where : {role_name : 'nasc'}
		})
		
		if(!n){
			await Role.create({
				role_name : 'nasc'
			}, {transaction : transaction});
		}

		

		let ns = await Role.findOne({
			where : {role_name : 'nigsims'}
		})
		
		if(!ns){
			await Role.create({
				role_name : 'nigsims'
			}, {transaction : transaction});
		}
		transaction.commit();

	}catch(e){
		transaction.rollback();
		console.log(e)
	}

}

module.exports = {seedAdminData}