const express = require('express')
const Category = require('../models/category')
const { parseErrorMessage } = require('../utils/helper')

const router = express.Router()

router.get('/categories', async (req, res) => {
	try {
		const categories = await Category.find()

		return res.json({
			success: true,
			categories
		})
	} catch (err) {
		return parseErrorMessage(res, err)
	}
})

router.post('/categories', async (req, res) => {
	try {
		const category = new Category()
		category.name = req.body.name
		category.slug = req.body.slug
		category.meta_description = req.body.meta_description || null
		category.meta_keywrods = req.body.meta_keywrods || null
		category.content = req.body.content || null
		category.parent_id = req.body.parent_id || null
		category.user_id = req.user._id

		await category.save()

		return res.status(201).json({
			success: true,
			message: 'Category saved successfully!',
			category
		})
	} catch (err) {
		return parseErrorMessage(res, err)
	}
})

router.get('/categories/:id', async (req, res) => {
	try {
		const category = await Category.findById(req.params.id)
		if (!category) {
			return res.status(404).json({
				error: 'No category found!'
			})
		}

		return res.json(category)
	} catch (err) {
		return parseErrorMessage(res, err)
	}
})

router.patch('/categories/:id', async (req, res) => {
	try {
		let categoryFields = [
			'name', 'slug', 'meta_description', 'meta_keywords', 'content', 'parent_id'
		];

		const filter = Object.keys(req.body).forEach(key => !categoryFields.includes(key))
		if (filter) {
			return res.status(400).json({
				error: "Invalid properties to update.",
			})
		}

		const category = await Category.findById(req.params.id)
		if (!category) {
			return res.status(404).json({
				error: 'No category found!'
			})
		}

		Object.keys(req.body).forEach(field => {
			category[field] = req.body[field]
		})

		if (category.isModified('parent_id') && category.parent_id.toString() === category._id.toString()) {
			throw new Error('Category cannot be parent category itself!')
		}

		await category.save()

		return res.status(204).send()
	} catch (err) {
		return parseErrorMessage(res, err)
	}
})

router.delete('/categories/:id', async (req, res) => {
	try {
		const category = await Category.findByIdAndDelete(req.params.id)
		if (!category) {
			return res.status(404).json({
				error: 'No category found!'
			})
		}

		return res.json({
			success: true,
			message: 'Category deleted successfully!',
			category
		})
	} catch (err) {
		return parseErrorMessage(res, err)
	}
})

module.exports = router