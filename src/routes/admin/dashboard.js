const express = require('express')

const router = new express.Router()

router.get('/dashboard', async (req, res) => {
	return res.send('Dashboard')
})

module.exports = router