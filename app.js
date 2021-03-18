const express = require('express')
const ejs = require('ejs')
const path = require('path')
const bodyParser = require('body-parser')
var session = require('express-session');
const fileUpload = require('express-fileupload')
require('dotenv').config()
require('./db.js');
const pageRouter = require('./routers/admin/page')
const categoryRouter = require('./routers/admin/category')
const productRouter = require('./routers/admin/product')


const app = express()

//bodyParser midlleware
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(fileUpload())
//loading the static files
app.use(express.static(path.join(__dirname + '/public')))
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

//views engine
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')


//errors var
app.locals.errors = null


//flashing messages middleware
app.use(function (req, res, next) {
  res.locals.flash = req.session.flash
  delete req.session.flash
  next();
});




//Routers
app.use('/admin/pages', pageRouter)
app.use('/admin/categories', categoryRouter)
app.use('/admin/products', productRouter)



//port
app.get('/', async (req, res) => {
  res.render('index', {
    'title': "In the Name of God"
  });
});











app.listen(process.env.PORT, () => {
  console.log('server starts at ' + process.env.PORT)
})