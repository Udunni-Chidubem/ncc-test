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
const NumeralHelper = require("handlebars.numeral");
const passpportInitializer = require('./src/helpers/passport-config')
const swaggerUi = require("swagger-ui-express");
const swaggerSpec=require('./src/config/swaggerOptions');
const morgan = require('morgan');
const fs = require('fs');
const worker = require('./src/helpers/worker,threads');
const passportJwt = require('./src/helpers/passport-jwt')
const bootstrap = require("./src/helpers/bootstrap.service");
bootstrap
passpportInitializer(passport)


const uid = () => {
  return Date.now().toString(36) 
  // Math.random().toString(36).substr(2);
};

// Usage. Example, id = khhry2hb7uip12rj2iu

const {seedAdminData} = require('./src/helpers/bootstrapUser')

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
        ifNotEquals(arg1, arg2, options) {
            return (arg1 != arg2) ? options.fn(this) : options.inverse(this);
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
        },
        cancatArray(array, done){
            let res=null
            array=JSON.parse(array)
            array.forEach(a=>{
                if(res!=null)
                    res=res+','+a
                else
                    res=a
            })
            console.log(a)
            return done.fn(res)
        }
    }
}))

Handlebars.registerHelper('paginate', paginate);
Handlebars.registerHelper('dateFormat', require('handlebars-dateformat'));
NumeralHelper.registerHelpers(Handlebars);

Handlebars.registerHelper({
    eq: (v1, v2) => v1 === v2,
    ne: (v1, v2) => v1 !== v2,
    lt: (v1, v2) => v1 < v2,
    gt: (v1, v2) => v1 > v2,
    lte: (v1, v2) => v1 <= v2,
    gte: (v1, v2) => v1 >= v2,
    and() {
        return Array.prototype.every.call(arguments, Boolean);
    },
    or() {
        return Array.prototype.slice.call(arguments, 0, -1).some(Boolean);
    }
});

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

var logDirectory = path.join(__dirname, "logs");
// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
 
var logFile = path.join(logDirectory, Date.now()+".log");
var accessLogStream = fs.createWriteStream(logFile, {
  flags: "a"
});
//const accessLogStream=fs.createWriteStream(path.join(__dirname+"/logs", Date.now()+".log"),{flags:'a'})
app.use(morgan("combined", { stream: accessLogStream }));

app.use((err, req, res, next)=>{
    res.locals.error=err
    console.log(err)
    return next()
})
//   let specs=swaggerJsdoc(options)
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, { explorer: true })
);

const mainRoute = require('./src/routes/main.route')
const { reverse } = require('dns')

app.use('/', mainRoute)
app.use(async function (req, res) {
    res.status(400).render('site/404', {
        layout: "404",
        error_msg: 'We are unable to process your request. Please try again',
    })
})

const PORT = process.env.ACCESS_PORT || 5800
server.listen(PORT, function(){
    console.log(`NIGSIMS is running on PORT ${PORT}`)
})

app.use('/robots.txt', function (req, res, next) {
    res.type('text/plain')
    res.send("User-agent: *\Disallow: /");
});
// const random = new Random();
// const value = random.integer(1, 1000000);
// console.log(value)
 seedAdminData()