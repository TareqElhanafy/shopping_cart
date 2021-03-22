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
const dashboardRouter = require('./routers/admin/dashboard')
const frontRouter = require('./routers/front/front')
const app = express()

//bodyParser midlleware
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(fileUpload())
//loading the static files
app.use(express.static(path.join(__dirname + '/public')))
// creating session middleware
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
app.locals.pages = null


//flashing messages middleware
app.use(function (req, res, next) {
  res.locals.flash = req.session.flash
  res.locals.form = req.session.form
  delete req.session.flash
  delete req.session.form
  next();
});

//setting the front navbar dynamically

const Page = require('./models/page')
Page.find({}).sort({ sorting: "asc" }).exec(function (error, pages) {
  if (error) {
    console.log(error);
  }
    app.locals.pages = pages
})



//Routers
app.use('/admin/pages', pageRouter)
app.use('/admin/categories', categoryRouter)
app.use('/admin/products', productRouter)
app.use('/admin', dashboardRouter)
app.use('/', frontRouter)

//port
app.listen(process.env.PORT, () => {
  console.log('server starts at ' + process.env.PORT)
})