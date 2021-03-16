const express = require('express')
const ejs = require('ejs')
const path = require('path')
const bodyParser = require('body-parser')
var session = require('express-session');
require('dotenv').config()
require('./db.js');
const adminRouter = require('./routers/admin')



const app = express()

//bodyParser midlleware
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())


app.use(session({
  secret: 'secret',
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


//loading the static files
app.use(express.static(path.join(__dirname + 'public')))

//Routers
app.use('/admin', adminRouter)



//port
app.get('/', async (req, res) => {
  res.render('index', {
    'title': "In the Name of God"
  });
});











app.listen(process.env.PORT, () => {
  console.log('server starts at ' + process.env.PORT)
})