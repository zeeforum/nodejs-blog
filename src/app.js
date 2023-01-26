const path = require('path')
const express = require('express')
const hbs = require('./utils/handlebars')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const app = express()

// Setup views path and engine
const publicPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup template engine and  directory structure
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Static assets & body parsing
app.use(express.static(publicPath))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
	extended: true
}))
app.use((req, res, next) => {
	app.locals.body = req.body
	next()
})

// Cookies middleware
app.use(cookieParser())

// Admin routes & locals setup
const baseUrl = process.env.BASE_URL || '/'
const adminUrl = process.env.ADMIN_URL || '/admin'

hbs.localsAsTemplateData(app)
app.locals.baseUrl = baseUrl
app.locals.adminUrl = baseUrl + adminUrl

module.exports = app