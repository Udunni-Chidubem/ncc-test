const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const server = require('http').createServer(app)
const handlebars = require('express-handlebars')
const Handlebars = require('handlebars');
const paginate = require('handlebars-paginate')
const passport = require('passport')
const path = require('path')
const fileUpload = require('express-fileupload');
const methodOveride = require('method-override')
const session = require('express-session');
const flash = require('express-flash')
const passpportInitializer = require('./src/helpers/passport-config')
passpportInitializer(passport)

const {seedAdminData} = require('./src/helpers/bootstrapUser')


// seedAdminData()


app.set('view engine', 'hbs')
app.engine('hbs', handlebars({
    layoutsDir: 'views/layouts',
    views:  'views',
    defaultLayout: 'main',
    extname: 'hbs',
    partialsDir: 'views/_partials',
    helpers: {
        ifEquals(arg1, arg2, options) {
            return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
        },
        concat(){
            arguments = [...arguments].slice(0, -1);
            return arguments.join('');
        },
        for(from, to, incr, block){
            var accum = '';
            for(var i = from; i <= to; i += incr)
                accum += block.fn(i);
            return accum;
        },
        equals(a, b, options){
            return (a === b ) ? options.fn(this) : options.fn(reverse)
        },
        add(a, b, sum){
            b += a;
            return b;
        },
        sub(a, b, sub){
            b-= a
            return b
        },
        increment(inindex){
            return inindex + 1
        },
        json(data, resp){           
            data = JSON.parse(data)
            return resp.fn(data);
        },
        itemSum(items, sum){
            let s=0
            items.forEach(i=>{
                s=Number(s)+Number(i.total_amount)
            })
            return sum.fn(s)
        }

    }
}))

Handlebars.registerHelper('paginate', paginate);

app.use(express.static(path.join(__dirname, 'public')))

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use(methodOveride('_method'))
app.use(fileUpload({
    createParentPath: true
}));
const mainRoute = require('./src/routes/main.route')
const { reverse } = require('dns')

app.use('/', mainRoute)

app.use(async function (req, res) {
    //const user = await req.user
    //console.log(user);
    res.status(400).render('site/404', {
        //layout: "main",
        error_msg: 'We are unable to process your request. Please try again',
    })
})

const PORT = process.env.ACCESS_PORT || 5200
server.listen(PORT, function(){
    console.log(`NIGSIMS is running on PORT ${PORT}`)
})