const express = require('express')
const crypto = require('crypto')
const User = require('../models/user')
const apiAuthMiddleware = require('../middleware/api-auth')
const { parseErrorMessage } = require('../utils/helper')
const { uploadAvatar } = require('../utils/upload')
const { loginValidation, emailValidation } = require('../middleware/admin/auth-validation')
const sendEmail = require('../utils/send-email')

const router = new express.Router();

router.post('/users', async (req, res) => {
	try {
		const user = new User()

		user.name = req.body.name
		user.username = req.body.username
		user.email = req.body.email
		user.password = req.body.password

		await user.save()
		let token = await user.generateAuthToken()
		return res.json({
			user,
			token
		})
	} catch (err) {
		return parseErrorMessage(res, err)
	}
})

router.post('/users/login', loginValidation, async (req, res) => {
	try {
		const user = await User.findByCredentials(req.body.email, req.body.password)
		const token = await user.generateAuthToken()
		return res.json({
			user,
			token
		})
	} catch (err) {
		return parseErrorMessage(res, err)
	}
})

router.post('/users/forgot-password', emailValidation, async (req, res) => {
	try {
		let forgotPasswordToken = crypto.randomBytes(36).toString('hex')
		const user = await User.findOneAndUpdate({
			email: req.body.email
		}, {
			forgotPassword: forgotPasswordToken
		})

		if (!user) {
			return res.status(422).json({
				"error": {
					"email": "Email not found!"
				}
			})
		}

		sendEmail(user, {
			name: user.name,
			resetPasswordLink: `${res.app.locals.baseUrl}/reset-password/${forgotPasswordToken}`
		})

		return res.json({
			user,
			forgotPasswordToken
		})
	} catch (err) {
		return parseErrorMessage(res, err)
	}
})

router.get('/users/me', apiAuthMiddleware, (req, res) => {
	return res.json({
		user: req.user
	})
})

router.post('/users/avatar', apiAuthMiddleware, async (req, res) => {
	try {
		await uploadAvatar(req, res, async (err) => {
			if (err) {
				return res.status(422).json({
					error: err.message
				})
			}

			req.user.profile_picture = req.file.filename
			await req.user.save()
		})
		
		return res.json({
			success: true,
			message: "Profile picture uploaded successfully!"
		})
	} catch (err) {
		return parseErrorMessage(res, err)
	}
})

router.post('/users/:id/permissions', apiAuthMiddleware, async (req, res) => {
	try {
		let user = await User.findById(req.params.id)
		if (!user) {
			return res.status(404).json({
				error: "No user found!"
			})
		}
		
		let permissions = req.body.permissions
		user.permissions = JSON.stringify(permissions)
		await user.save()

		return res.json({
			success: true,
			message: "User permissions saved successfully!",
			user
		})
	} catch (err) {
		return parseErrorMessage(res, err)
	}
})

router.patch('/users/:id/permissions', apiAuthMiddleware, async (req, res) => {
	try {
		let user = await User.findById(req.params.id)
		if (!user) {
			return res.status(404).json({
				error: "No user found!"
			})
		}
		
		let permissions = req.body.permissions
		let oldUserPermissions = JSON.parse(user.permissions)
		user.permissions = JSON.stringify(oldUserPermissions.concat(permissions))
		await user.save()

		return res.json({
			success: true,
			message: "User permissions saved successfully!",
			user
		})
	} catch (err) {
		return parseErrorMessage(res, err)
	}
})

router.post('/users/logout', apiAuthMiddleware, async (req, res) => {
	try {
		req.user.tokens = req.user.tokens.filter(token => req.token !== token.token)
		await req.user.save()

		return res.json({
			success: true,
			message: 'User logged out.'
		})
	} catch (err) {
		return parseErrorMessage(res, err)
	}
})

module.exports = router;