const express = require('express')
const Setting = require('../models/setting');
const { parseErrorMessage } = require('../utils/helper');

const router = new express.Router();

router.get('/settings', async (req, res) => {
	try {
		const settings = await Setting.find()

		return res.json({
			success: true,
			settings
		})
	} catch (err) {
		return parseErrorMessage(err)
	}
})

router.post('/settings', async (req, res) => {
	try {
		if (req.body.field_name) {
			await Setting.saveFieldWithValue(req.body.field_name, req.body.field_value)
		} else {
			for (let field in req.body.settings) {
				await Setting.saveFieldWithValue(req.body.settings[field]['field_name'], req.body.settings[field]['field_value'])
			}
		}

		return res.json({
			success: true,
			message: 'Setting saved successfully!'
		})
	} catch (err) {
		return parseErrorMessage(err)
	}
})

module.exports = router