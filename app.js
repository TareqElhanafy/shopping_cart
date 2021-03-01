const express = require('express')
const ejs = require('ejs')
const path = require('path')
require('dotenv').config()
require('./db.js');
const app = express()



app.set('views',path.join(__dirname + 'views'))
app.set('view engine', 'ejs')


app.use(express.static(path.join(__dirname + 'public')))
app.get('/', async (req,res) =>{
    res.send('heelo')
})















app.listen(process.env.PORT, ()=>{
    console.log('server starts at ' + process.env.PORT)
})