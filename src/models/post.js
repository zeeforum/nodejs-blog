const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
		index: true
	},
	slug: {
		type: String,
		required: true,
		unique: true
	},
	picture: {
		type: String,
		default: null
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
		required: true
	},
	created_by: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	},
	last_modified_by: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	}
}, {
	timestamps: true
})

const Post = mongoose.model('Post', postSchema)

module.exports = Post