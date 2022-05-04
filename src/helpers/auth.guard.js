module.exports = {
    //this will check if you are authenticated will be called on all protected routes
    auth : (req, res, next)=> {
    if(req.isAuthenticated())
        return next()
    else
       res.redirect('/login');
    },

    //this check if you have a session and will be called on the login route
    loggedIn:async (req, res, next)=>{
        if(req.isAuthenticated()){
            let user=await req.user
            let role = user.UserRole.Role.role_name
             if( role == 'farmer')
                return res.redirect('farmer/dashboard')

            if(role == 'seed_trader')
                return res.redirect('seed-trader/dashboard')

            if(role == 'seed_company')
                return res.redirect('seed-company/dashboard')

            if(role == 'admin' || role == 'nigsims' || role == 'nasc' || role == 'rra' )
                return res.redirect('admin/dashboard')

        }else{
            return next()
        }
            //this.redirect(res, req.user.User_role.Role.role_name)
    },

    //this will help handle redirects
    redirect : (req, res, role)=>{
           req.flash('user', req.user)
           if( role == 'farmer')
                return res.redirect('farmer/dashboard')
            
            if(role == 'seed_trader')
                return res.redirect('seed-trader/dashboard')

            if(role == 'seed_company')
                return res.redirect('seed-company/dashboard')
            
            if(role == 'admin' || role == 'nigsims' || role == 'nasc' || role == 'rra' )
                return res.redirect('admin/dashboard')

    },
    //this will be called on all farmers routes to see if the user role if farmer
    farmerPermission:async (req, res, next)=>{
        let user = JSON.parse(JSON.stringify(await req.user))
       // console.log(user.UserRole.Role)
        if(user.UserRole.Role.role_name=='farmer'){
            return next()
        }else{
            req.logOut()
            req.flash("error", "forbidden! this is not a farmer account")
            res.redirect("/login")
        }
    },
    //this will be called on all seed traders route to see the role is seed_trader
    seedTraderPermission :async (req, res, next)=>{
        let user = JSON.parse(JSON.stringify(await req.user))
       // console.log(user.UserRole.Role)
        if(user.UserRole.Role.role_name=='seed_trader'){
            return next()
        }else{
            req.logOut()
            req.flash("error", "forbidden! this is not a farmer account")
            res.redirect("/login")
        }
    },
    //this will be called on all seed company routes to see if the role is seed company
    seedCompanyPermission :async (req, res, next)=>{
        let user = JSON.parse(JSON.stringify(await req.user))
       // console.log(user.UserRole.Role)
        if(user.UserRole.Role.role_name=='seed_company'){
            return next()
        }else{
            req.logOut()
            req.flash("error", "forbidden! this is not a farmer account")
            res.redirect("/login")
        }
    },
    //this will be called on all seed company routes to see if the role is seed company
    adminPermission :async (req, res, next)=>{
        let user = JSON.parse(JSON.stringify(await req.user))
       // console.log(user.UserRole.Role)
        if(user.UserRole.Role.role_name=='admin' || user.UserRole.Role.role_name=='nasc' || user.UserRole.Role.role_name=='nigsims' || user.UserRole.Role.role_name=='rra' ){
            return next()
        }else{
            req.logOut()
            req.flash("error", "Unauthorized")
            res.redirect("/login")
        }
    }

}