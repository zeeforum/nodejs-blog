const jwt = require('jsonwebtoken')
const User = require('../models/user')

const sendUnauthorized = (res) => {
	return res.status(401).json({
		error: 'Unauthorized.'
	})
}

const apiAuthMiddleware = async (req, res, next) => {
	try {
		if (!req.header('Authorization')) return sendUnauthorized(res)

		let token = req.header('Authorization').replace('Bearer ', '')
		let data = jwt.verify(token, process.env.JWT_SECRET)
		if (!data) return sendUnauthorized(res)

		const user = await User.findOne({
			_id: data._id,
			'tokens.token': token
		})
		if (!user) return sendUnauthorized(res)

		req.user = user
		req.token = token

		next()
	} catch (err) {
		return sendUnauthorized(res)
	}
}

module.exports = apiAuthMiddleware