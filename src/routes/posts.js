const express = require('express')
const multer = require('multer')

const Post = require('../models/post')
const { parseErrorMessage } = require('../utils/helper')
const { uploadPostImage } = require('../utils/upload')

const router = new express.Router()

router.get('/posts', async (req, res) => {
	try {
		const posts = await Post.find().limit(10)
		
		return res.json({
			success: true,
			posts
		})
	} catch (err) {
		return res.status(500).json({
			error: "Server error!"
		})
	}
})

router.post('/posts', uploadPostImage, async (req, res) => {
	try {
		const post = new Post()

		if (req.files && req.files.picture && req.files.picture.length > 0) {
			post.picture = req.files.picture[0].filename
		}

		post.title = req.body.title
		post.slug = req.body.slug
		post.meta_description = req.body.meta_description
		post.meta_keywords = req.body.meta_keywords
		post.content = req.body.content
		post.created_by = req.user._id
		post.last_modified_by = req.user._id

		await post.save()
		return res.status(201).json({
			success: true,
			post
		})
	} catch (err) {
		return parseErrorMessage(res, err)
	}
})

router.patch('/posts/:id', uploadPostImage, async (req, res) => {
	try {
		let postFields = [
			'title', 'slug', 'meta_description', 'meta_keywords', 'content'
		];

		if (req.files && req.files.picture && req.files.picture.length > 0) {
			post.picture = req.files.picture[0].filename
		}

		const filter = Object.keys(req.body).forEach(key => !postFields.includes(key))
		if (filter) {
			return res.status(400).json({
				error: "Invalid properties to update.",
			})
		}

		const post = await Post.findById(req.params.id)
		if (!post) {
			return res.status(404).json({
				error: 'No post found!'
			})
		}

		Object.keys(req.body).forEach(field => {
			post[field] = req.body[field]
		})
		post.last_modified_by = req.user._id
		await post.save()

		return res.status(204).send()
	} catch (err) {
		return res.status(500).json({
			error: "Server error!"
		})
	}
})

router.delete('/posts/:id', async (req, res) => {
	try {
		const post = await Post.findByIdAndDelete(req.params.id)

		return res.json({
			success: true,
			message: "Post deleted successfully!",
			post
		})
	} catch (err) {
		return parseErrorMessage(err)
	}
})

module.exports = router