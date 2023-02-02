const app = require('./src/app')

// API Router
const userRouter = require('./src/routes/users')
const categoriesRouter = require('./src/routes/categories')
const postsRouter = require('./src/routes/posts')
const settingsRouter = require('./src/routes/settings')

// ADMIN ROUTER
const authRouter = require('./src/routes/admin/auth')
const dashboardRouter = require('./src/routes/admin/dashboard')
const { authMiddleware } = require('./src/middleware/admin/auth')
const apiAuthMiddleware = require('./src/middleware/api-auth')

require('./src/db/mongoose')


// API routes
app.use('/api', userRouter)
app.use('/api', apiAuthMiddleware, categoriesRouter)
app.use('/api', apiAuthMiddleware, postsRouter)
app.use('/api', apiAuthMiddleware, settingsRouter)


const adminUrl = process.env.ADMIN_URL || '/admin'

// Admin routes
app.use(adminUrl, authRouter)
app.use(adminUrl, authMiddleware, dashboardRouter)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
	console.log(`${new Date().toString()} Listening on Port http://localhost:3000`)
})