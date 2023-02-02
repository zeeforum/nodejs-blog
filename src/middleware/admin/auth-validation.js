const validator = require('validator')

const loginValidation = (req, res, next) => {
	let errors = {}

	if (!req.body.email || validator.isEmpty(req.body.email)) {
		errors['email'] = "Email is required."
	} else if (!validator.isEmail(req.body.email)) {
		errors['email'] = "Please enter a valid email address."
	}

	if (!req.body.password || validator.isEmpty(req.body.password)) {
		errors['password'] = "Password is required."
	}

	if (Object.keys(errors).length > 0) {
		return res.status(422).json({
			error: errors
		})
	}

	next()
}

const emailValidation = (req, res, next) => {
	let errors = {}

	if (!req.body.email || validator.isEmpty(req.body.email)) {
		errors['email'] = "Email is required."
	} else if (!validator.isEmail(req.body.email)) {
		errors['email'] = "Please enter a valid email address."
	}

	if (Object.keys(errors).length > 0) {
		return res.status(422).json({
			error: errors
		})
	}

	next()
}

module.exports = {
	loginValidation,
	emailValidation
}