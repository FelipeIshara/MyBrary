const express = require('express')
const app = express()
const espressLayouts = require('express-ejs-layouts')
const indexRouter = require('./routes/index')

//Configuração
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(espressLayouts)
app.use(express.static('public'))

app.use('/', indexRouter)



app.listen(process.env.PORT || 3000)