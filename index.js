const path = require('path')
const express = require('express')
const hbs = require('hbs')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

// API Router
const authMiddleware = require('./src/middleware/auth')
const userRouter = require('./src/routes/users')
const categoriesRouter = require('./src/routes/categories')
const postsRouter = require('./src/routes/posts')
const settingsRouter = require('./src/routes/settings')

// ADMIN ROUTER
const loginRouter = require('./src/routes/admin/login')

require('./src/db/mongoose')

const app = express()

// Setup views path and engine
const publicPath = path.join(__dirname, './public')
const viewsPath = path.join(__dirname, './templates/views')
const partialsPath = path.join(__dirname, './templates/partials')

app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

app.use(express.static(publicPath))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
	extended: true
}))
app.use(cookieParser())

// API routes
app.use('/api', userRouter)
app.use('/api', authMiddleware, categoriesRouter)
app.use('/api', authMiddleware, postsRouter)
app.use('/api', authMiddleware, settingsRouter)

// Admin routes & locals setup
const baseUrl = process.env.BASE_URL || '/'
const adminUrl = process.env.ADMIN_URL || '/admin'

hbs.localsAsTemplateData(app)
app.locals.baseUrl = baseUrl
app.locals.adminUrl = baseUrl + adminUrl

app.use(adminUrl, loginRouter)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
	console.log(`${new Date().toString()} Listening on Port http://localhost:3000`)
})