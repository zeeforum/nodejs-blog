const express = require('express')

const router = new express.Router()

router.get('/dashboard', async (req, res) => {
	console.log('Dashboard Page')
	return res.render('dashboard')
})

module.exports = router