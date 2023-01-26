const jwt = require('jsonwebtoken')
const User = require('../models/user')

const sendUnauthorized = (res) => {
	return res.status(401).json({
		error: 'Unauthorized.'
	})
}

const authMiddleware = async (req, res, next) => {
	if (!req.header('Authorization')) return sendUnauthorized(res)

	let token = req.header('Authorization').replace('Bearer ', '')
	let data = await jwt.verify(token, process.env.JWT_SECRET)
	if (!data) return sendUnauthorized(res)

	const user = await User.findOne({
		_id: data._id,
		'tokens.token': token
	})
	if (!user) return sendUnauthorized(res)

	req.user = user
	req.token = token

	next()
}

module.exports = authMiddleware