const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const server = require('http').createServer(app)
const handlebars = require('express-handlebars')
const passport = require('passport')
const path = require('path')
const session = require('express-session');
const flash = require('express-flash')
const passpportInitializer = require('./src/helpers/passport-config')
passpportInitializer(passport)

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
        }
    }
}))

app.use(express.static(path.join(__dirname, 'public')))

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(session({
	secret: 'secret',
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
const mainRoute = require('./src/routes/main.route')

app.use('/', mainRoute)

const PORT = process.env.ACCESS_PORT || 5200
server.listen(PORT, function(){
    console.log(`NIGSIMS Application is running on PORT ${PORT}`)
})