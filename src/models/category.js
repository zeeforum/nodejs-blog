const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	parent_id: {
		type: mongoose.Schema.Types.ObjectId,
		default: null
	},
	slug: {
		type: String,
		required: true,
		unique: true
	},
	meta_description: {
		type: String,
		default: null
	},
	meta_keywords: {
		type: String,
		default: null
	},
	content: {
		type: String,
		default: null
	},
	user_id: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	}
}, {
	timestamps: true
})

const Category = mongoose.model('Category', categorySchema)

module.exports = Category