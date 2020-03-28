const mongoose = require('mongoose')
const validator = require('validator') // use npm validator for complex validations like email, SSN, etc.
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
	email: {
		type: String,
		unique: true, // users cannot register unique email more than once
		required: true,
		trim: true,
		lowercase: true,
		validate(value) {
			if (!validator.isEmail(value)) {
				throw new Error('Email is invalid.')
			}
		}
	},
	password: {
		type: String,
		required: true,
		trim: true,
		minlength: 6,
		validate(value) {
		if (value.toLowerCase().includes('password')) {
				throw new Error('Cannot set "password" as the password.')
			}
		}
	},
	tokens: [{
		token: {
			type: String,
			required: true
		}
	}]
})

userSchema.methods.generateAuthToken = async function() {
	const user = this
	const token = jwt.sign({ _id: user._id.toString() }, 'overwatchboostingauth')
	user.tokens = user.tokens.concat({ token })
	await user.save()
	return token
}

userSchema.statics.findByCredentials = async (email, password) => {
	const user = await User.findOne({ email }) // find user by email
	if (!user) {
		throw new Error('Unable to login') // email address does not exist
	}

	const isMatch = await bcrypt.compare(password, user.password) // verify password using compare function
	if (!isMatch) {
		throw new Error('Unable to login') // email exists, password is incorrect
	}

	return user // if email and password are both correct
}

// Hash the plain text password before saving
userSchema.pre('save', async function (next) {
	const user = this // user to be saved
	if (user.isModified('password')) { // Hash password if it's been modified by the user
		user.password = await bcrypt.hash(user.password, 8) // 2nd arg = # of hashing rounds to perform
	}
	next() // needed to save the user
})

const User = mongoose.model('User', userSchema)

module.exports = User
