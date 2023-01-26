const path = require('path')
const fs = require('fs')
const multer = require('multer')

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		let filePath = path.join(__dirname, '../../public/uploads/users')
		fs.mkdirSync(filePath, { recursive: true })
		cb(null, filePath)
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
		cb(null, uniqueSuffix + '-' + file.originalname)
	}
})

const postStorage = multer.diskStorage({
	destination: function (req, file, cb) {
		let postFilePath = path.join(__dirname, '../../public/uploads/posts')
		fs.mkdirSync(postFilePath, { recursive: true })
		cb(null, postFilePath)
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
		cb(null, uniqueSuffix + '-' + file.originalname)
	}
})

const upload = multer({
	storage: storage,
	fileFilter: function (req, file, cb) {
		if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
			return cb(null, true);
		}
		
		return cb(new Error('Invalid file type!'));
	},
	limits: {
		fileSize: 8000000
	}
})

const uploadPostImage = multer({
	storage: postStorage,
	fileFilter: function (req, file, cb) {
		if (file.fieldname === 'picture') {
			if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
				return cb(null, true);
			}
			
			return cb(new Error('Invalid file type!'));
		}

		return cb(null, true)
	},
	limits: {
		fileSize: 8000000
	}
}).fields([
	{name: "title", maxCount: 1},
	{name: "slug", maxCount: 1},
	{name: "meta_description", maxCount: 1},
	{name: "meta_keywords", maxCount: 1},
	{name: "content", maxCount: 1},
	{name: "picture", maxCount: 1}
])

const uploadAvatar = upload.single('picture')

module.exports = {
	uploadAvatar,
	uploadPostImage
}