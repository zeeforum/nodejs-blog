const express = require('express')
const validator = require('validator')
const User = require('../models/user')
const authMiddleware = require('../middleware/auth')
const { parseErrorMessage } = require('../utils/helper')
const { uploadAvatar } = require('../utils/upload')

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
		return parseErrorMessage(err)
	}
})

router.post('/users/login', async (req, res) => {
	try {
		let errors = {}
		if (validator.isEmpty(req.body.email)) {
			errors['email'] = "Email is required."
		} else if (!validator.isEmail(req.body.email)) {
			errors['email'] = "Please enter a valid email address."
		}

		if (validator.isEmpty(req.body.password)) {
			errors['password'] = "Password is required."
		}

		if (Object.keys(errors).length > 0) {
			return res.status(422).json({
				error: errors
			})
		}

		const user = await User.findByCredentials(req.body.email, req.body.password)
		const token = await user.generateAuthToken()
		return res.json({
			user,
			token
		})
	} catch (err) {
		return parseErrorMessage(err)
	}
})

router.get('/users/me', authMiddleware, (req, res) => {
	return res.json({
		user: req.user
	})
})

router.post('/users/avatar', authMiddleware, async (req, res) => {
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
		return parseErrorMessage(err)
	}
})

router.post('/users/:id/permissions', authMiddleware, async (req, res) => {
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
		return parseErrorMessage(err)
	}
})

router.patch('/users/:id/permissions', authMiddleware, async (req, res) => {
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
		return parseErrorMessage(err)
	}
})

router.post('/users/logout', authMiddleware, async (req, res) => {
	try {
		req.user.tokens = req.user.tokens.filter(token => req.token !== token.token)
		await req.user.save()

		return res.json({
			success: true,
			message: 'User logged out.'
		})
	} catch (err) {
		return parseErrorMessage(err)
	}
})

module.exports = router;