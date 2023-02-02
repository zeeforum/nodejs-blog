const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const mongoose = require('../db/mongoose')

const userSchema = new mongoose.Schema({
	name: {
		type: "String",
		required: [true, "Name is required."]
	},
	username: {
		type: "String",
		required: [true, "Username is required."]
	},
	email: {
		type: "String",
		unique: true,
		required: [true, "Email is required."],
		validate: {
			validator: (value) => validator.isEmail(value),
			message: "Please enter a valid email address."
		}
	},
	password: {
		type: "String",
		required: [true, "Password is required."],
		minLength: [6, "Password is shorter than the minimum allowed length 6."]
	},
	profile_picture: {
		type: "String"
	},
	forgotPassword: {
		type: "String",
		default: null,
	},
	tokens: [
		{
			token: {
				type: "String",
				required: true
			}
		}
	],
	role: {
		type: "String",
		default: "admin",
		enum: ['admin', 'editor', 'moderator', 'user', 'writer']
	},
	permissions: {
		type: "String",
		default: null
	}
}, {
	timestamps: true
})

userSchema.statics.findByCredentials = async (email, password) => {
	const user = await User.findOne({ email: email })
	if (!user) throw new Error('Unable to find user.')

	const isMatch = await bcrypt.compare(password, user.password)
	if (!isMatch) throw new Error('Username/Password mismatch.')

	return user
}

userSchema.methods.generateAuthToken = async function() {
	const user = this
	
	const token = jwt.sign({
		_id: user._id.toString()
	}, process.env.JWT_SECRET)
	user.tokens = user.tokens.concat({ token })
	await user.save()

	return token
}

userSchema.methods.toJSON = function () {
	let user = this
	user = user.toObject()
	
	delete user.password
	delete user.forgotPassword
	delete user.tokens

	return user
}

userSchema.pre('save', async function (next) {
	const user = this

	if (user.isModified('password')) {
		user.password = await bcrypt.hash(user.password, 8)
	}

	next()
})

const User = mongoose.model('User', userSchema)

module.exports = User