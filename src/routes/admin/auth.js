const axios = require('axios')
const express = require('express')
const { guestMiddleware } = require('../../middleware/admin/auth')
const { setSuccess } = require('../../utils/helper')

const router = new express.Router()

router.all('/login', guestMiddleware, async (req, res) => {
	let error = null
	if (req.method === 'POST') {
		try {
			let { data, status } = await axios.post(process.env.API_URL + '/users/login', req.body)
			
			if (status === 200) {
				return res.cookie('token', data.token).redirect(res.app.locals.adminUrl + '/dashboard')
			}
		} catch (err) {
			error = err.response.data
		}
	}

	return res.render('login', {
		title: "Login",
		error
	})
})

router.all('/forgot-password', guestMiddleware, async (req, res) => {
	let error = null
	if (req.method === 'POST') {
		try {
			let { data, status } = await axios.post(process.env.API_URL + '/users/forgot-password', req.body)
			
			if (status === 200) {
				setSuccess(req, "Reset Password email sent successfully!")
				return res.redirect(res.app.locals.adminUrl + '/login')
			}
		} catch (err) {
			error = err.response.data
		}
	}

	return res.render('forgot-password', {
		title: "Forgot Password",
		error
	})
})

module.exports = router