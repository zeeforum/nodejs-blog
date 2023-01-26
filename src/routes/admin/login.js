const axios = require('axios')
const express = require('express')
const { makeErrorCookies } = require('../../utils/helper')

const router = new express.Router()

router.all('/login', async (req, res) => {
	let error = null
	if (req.method === 'POST') {
		try {
			await axios.post(process.env.BASE_URL + '/api/users/login', req.body)

			// Todo: Get & Save token in cookie
		} catch (err) {
			error = err.response.data
		}
	}

	return res.render('login', {
		title: "Login",
		error
	})
})

module.exports = router