const axios = require('axios')
const express = require('express')

const router = new express.Router()

router.all('/login', async (req, res) => {
	let error = null
	if (req.method === 'POST') {
		try {
			let { data, status } = await axios.post(process.env.API_URL + '/users/login', req.body)
			
			if (status === 200) {
				return res.cookie('token', data.token).redirect(req.app.locals.adminUrl + '/dashboard')
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

module.exports = router