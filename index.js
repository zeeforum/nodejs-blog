const express = require('express')

const authMiddleware = require('./src/middleware/auth')
const userRouter = require('./src/routes/users')
const categoriesRouter = require('./src/routes/categories')
const postsRouter = require('./src/routes/posts')
const settingsRouter = require('./src/routes/settings')
require('./src/db/mongoose')

const app = express()

app.use(express.json())
app.use('/api/admin', userRouter)
app.use('/api/admin', authMiddleware, categoriesRouter)
app.use('/api/admin', authMiddleware, postsRouter)
app.use('/api/admin', authMiddleware, settingsRouter)


const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
	console.log(`${new Date().toString()} Listening on Port http://localhost:3000`)
})