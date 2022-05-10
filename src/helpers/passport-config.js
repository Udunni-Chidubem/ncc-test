localStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt');
const { User, Farmer, SeedTrader, UserRole, Role} = require('../models')

function initialize(passport){
    async function getUserById(id){
        return await User.findOne({
            include : [{
                model : UserRole,
                include : [{model : Role}]
            }],
            where: { 
                id: id 
            },
            attributes: ['id', 'username', 'status', 'token', 'created_at', 'updated_at']

        })
    }
    async function authenticateUser(username, password, done){
        try{
            const user = await User.findOne(
                { 
                    include : [{
                        model : UserRole,
                        include : [{model : Role}]
                    }],  
                    where: { 
                        username: username 
                    },
                }
            );
            // console.log(user)
            if(user != null ){
                if(await bcrypt.compare(password, user.password) == true){
                    if(user.status!=2){
                        return done(null, user);
                    }else{
                        return done(null, false, {message : "Account is not activated"});
                    } 
                }
            }
            return done(null, false, {message : "You have entered Invalid credentials. Please try again!!!"});
        }catch(e){
            return done(e)
        } 
        
    }
    passport.use(new localStrategy(authenticateUser))
    passport.serializeUser((user, done)=>done(null, user.id))
    passport.deserializeUser((id, done)=>{
        return done(null, getUserById(id))
    })
}
module.exports=initialize