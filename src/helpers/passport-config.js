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
            } 
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
                    } 
                }
            );
            if(user != null ){
                if(await bcrypt.compare(password, user.password) == true){
                    return done(null, user);
                }
            }
            return done(null, false, {message : "invalid credentials"});
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