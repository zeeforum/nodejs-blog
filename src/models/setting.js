const mongoose = require('mongoose')

const settingSchema = new mongoose.Schema({
	field_name: {
		type: String,
		required: true
	},
	field_value: {
		type: String,
		required: true
	}
}, {
	timestamps: true
})

settingSchema.statics.saveFieldWithValue = async (field, value) => {
	try {
		const setting = await Setting.findOne({
			field_name: field
		}) || new Setting()

		setting.field_name = field
		setting.field_value = value

		await setting.save()
	} catch (err) {
		throw new Error(`Database error: ${err.message}`)
	}
}

const Setting = mongoose.model('Setting', settingSchema)

module.exports = Setting