module.exports = {
    //this will check if you are authenticated will be called on all protected routes
    auth : (req, res, next)=>{
    if(req.isAuthenticated())
        return next()
    else
       res.redirect('/login');
    },

    //this check if you have a session and will be called on the login route
    loggedIn: (req, res, next)=>{
        if(req.isAuthenticated()){
           res.redirect('/dashboard');
        }else{
            return next()
        }
            //this.redirect(res, req.user.User_role.Role.role_name)
    },

    //this will help handle redirects
    redirect : (req, res, role)=>{
           if( role == 'farmer')
                res.redirect('farmer/dashboard')
            
            if(role == 'seed_trader')
                res.redirect('seed-trader/dashboard')

            if(role == 'seed_company')
                res.redirect('seed-company/dashboard')
    },
    //this will be called on all farmers routes to see if the user role if farmer
    farmerPermission: (req, res, next)=>{

    },
    //this will be called on all seed traders route to see the role is seed_trader
    seedTraderPermission : (req, res, next)=>{

    },
    //this will be called on all seed company routes to see if the role is seed company
    seedCompanyPermission : (req, res, next)=>{

    }
}