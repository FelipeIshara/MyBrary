if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}


const express = require('express')
const app = express()
const espressLayouts = require('express-ejs-layouts')
const indexRouter = require('./routes/index')
const mongoose = require('mongoose')
//Configuração(view)
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(espressLayouts)
app.use(express.static('public'))

//mongoose config
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true}) 
const db = mongoose.connection
db.on('error', error => console.error(error)) 
db.once('open', () => console.log('Connected to Mongoose')) 

app.use('/', indexRouter)



app.listen(process.env.PORT || 3000)