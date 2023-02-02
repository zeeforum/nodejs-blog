const jwt = require('jsonwebtoken')
const User = require('../../models/user')

const sendUnauthorized = (req, res) => {
	return res.clearCookie("token").redirect(req.app.locals.adminUrl + '/login')
}

const guestMiddleware = (req, res, next) => {
	try {
		let { token } = req.cookies
		if (!token) {
			return next()
		}

		return res.redirect(req.app.locals.adminUrl + '/dashboard')
	} catch (e) {
		next()
	}
}

const authMiddleware = async (req, res, next) => {
	console.log('Auth')
	try {
		let { token } = req.cookies

		let data = jwt.verify(token, process.env.JWT_SECRET)
		if (!data) return sendUnauthorized(req, res)

		let user = await User.findOne({
			_id: data._id,
			'tokens.token': token
		})
		if (!user) return sendUnauthorized(req, res)

		user = user.toObject()
		delete user.tokens
		req.user = user
		req.token = token

		next()
	} catch (err) {
		return sendUnauthorized(req, res)
	}
}

module.exports = {
	authMiddleware,
	guestMiddleware
}