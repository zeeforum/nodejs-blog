const app = require('./src/app')

// API Router
const authMiddleware = require('./src/middleware/auth')
const userRouter = require('./src/routes/users')
const categoriesRouter = require('./src/routes/categories')
const postsRouter = require('./src/routes/posts')
const settingsRouter = require('./src/routes/settings')

// ADMIN ROUTER
const loginRouter = require('./src/routes/admin/login')

require('./src/db/mongoose')



// API routes
app.use('/api', userRouter)
app.use('/api', authMiddleware, categoriesRouter)
app.use('/api', authMiddleware, postsRouter)
app.use('/api', authMiddleware, settingsRouter)


const adminUrl = process.env.ADMIN_URL || '/admin'

// Admin routes
app.use(adminUrl, loginRouter)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
	console.log(`${new Date().toString()} Listening on Port http://localhost:3000`)
})