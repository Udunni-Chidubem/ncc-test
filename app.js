const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const server = require('http').createServer(app)
const handlebars = require('express-handlebars')
const path = require('path')

app.set('view engine', 'hbs')
app.engine('hbs', handlebars({
    layoutsDir: 'views/layouts',
    views: 'views',
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

const siteRoute = require('./src/routes/site.route')

app.use('/', siteRoute)

const PORT = process.env.ACCESS_PORT || 5200
server.listen(PORT, function(){
    console.log(`NIGSIMS is running on PORT ${PORT}`)
})