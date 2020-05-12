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
				throw new Error('The email you submitted was not valid.')
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
				throw new Error('Your password cannot contain the word "password".')
			} 
		}
	},
	btag: {
		type: String,
		trim: true,
		minlength: 8, // Min 3 characters + '#' + Min 4 numbers
		maxlength: 18, // Max 12 characters + '#' + Max 5 numbers
	},
	server: {
		type: String,
		validate(value) {
			if (!validator.isAlpha(value)) {
				throw new Error('Must contain only letters.')
			}
		}
	},
	name: {
		type: String,
		validate(value) {
			if (!validator.isAscii(value)) {
				throw new Error('Must contain only letters.')
			} else if (/\d/.test(value)) {
				throw new Error('Name field cannot contain any numbers.')
			} else if (/[&\/\\#,+=()@$~%`'":;*!?_^<>{}]/g.test(value)) {
				throw new Error('Name cannot contain special characters.')
			}
		}
	},
	tokens: [{
		token: {
			type: String,
			required: true
		}
	}],

})

userSchema.methods.toJSON = function () { // no arrow function because of usage of 'this'
	const user = this
	const userObject = user.toObject()

	delete userObject.password
	delete userObject.tokens
	delete userObject.__v

	return userObject
}

userSchema.methods.generateAuthToken = async function() { // no arrow function because of use of 'this'
	const user = this
	const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)
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
userSchema.pre('save', async function (next) { // no arrow function because of use of 'this'
	const user = this // user to be saved
	if (user.isModified('password')) { // Hash password if it's been modified by the user
		user.password = await bcrypt.hash(user.password, 8) // 2nd arg = # of hashing rounds to perform
	}
	next() // needed to save the user
})

const User = mongoose.model('User', userSchema)

module.exports = User
