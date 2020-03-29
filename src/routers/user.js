const path = require('path')
const express = require('express')
const User = require('../models/user') // Require user model file
const auth = require('../middleware/auth') // Require authentication middleware file
const router = new express.Router()

// ===== Create =====
// Register new user

router.post('/users', async (req, res) => {
	const user = new User(req.body)

	try {
		await user.save()
		const token = await user.generateAuthToken()
		res.cookie('auth_token', token)
		res.sendFile(path.resolve(__dirname, '..', 'views', 'dashboard.html'))
	} catch (e) {
		res.status(400).send(e)
	}
})

// Log in existing user
router.post('/users/login', async (req, res) => {
	try {
		const user = await User.findByCredentials(req.body.email, req.body.password)
		const token = await user.generateAuthToken()
		res.cookie('auth_token', token)
		res.sendFile(path.resolve(__dirname, '..', '..', 'public', 'index.html'))
	} catch (e) {
		res.status(400).send()
	}
})

// ===== Read =====
// Get user profile
router.get('/users/profile', auth, async (req, res) => {
	res.send(req.user)
})

// Read one user
router.get('/users/:id', async (req, res) => {
	const _id = req.params.id
	try {
		const user = await User.findById(_id)
		if (!user) {
			return res.status(404).send()
		}
		res.send(user)
	} catch (e) {
		res.status(500).send()
	}
})

// ===== Update =====
router.patch('/users/:id', async (req, res) => {

	const updates = Object.keys(req.body)
	const allowedUpdates = ['email', 'password']
	const isValidOperation = updates.every((update) => allowedUpdates.includes(update)) 
	// runs code for everything in allowedUpdates array

	if (!isValidOperation) {
		return res.status(400).send({ error: 'Invalid update' })
	}

	try {
		const user = await User.findById(req.params.id)

		updates.forEach((update) => user[update] = req.body[update])
		await user.save()

		if (!user) {
			return res.status(404).send()
		}

		res.send(user)
	} catch (e) {
		res.status(400).send(e)
	}

})

// ===== Delete =====
router.delete('/users/:id', async (req, res) => {

	try {
		const user = await User.findByIdAndDelete(req.params.id)

		if (!user) {
			return res.status(404).send()
		}

		res.send(user)

	} catch (e) {
		res.status(500).send(e)
	}

})

module.exports = router