const axios = require('axios')
const express = require('express')
const { makeErrorCookies } = require('../../utils/helper')

const router = new express.Router()

router.get('/login', (req, res) => {
	console.log(req.cookies.errors)
	return res.render('login')
})

router.post('/login', async (req, res) => {
	try {
		const response = await axios.post(process.env.BASE_URL + '/api/users/login', req.body)
		
		return res.json(response)
	} catch (err) {
		return makeErrorCookies(res, err, '/admin/login')
	}
})

module.exports = router