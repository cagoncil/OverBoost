const path = require('path')
const express = require('express')
const User = require('../models/user') // Require user model file
const auth = require('../middleware/auth') // Require authentication middleware file
const router = new express.Router()

// ===== Create =====
// Register new user

router.post('/welcome', async (req, res) => { 
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
router.post('/dashboard', async (req, res) => { // use one word instead of two ('/users/login') to load static files
	try {
		const user = await User.findByCredentials(req.body.email, req.body.password)
		const token = await user.generateAuthToken()
		res.cookie('auth_token', token)
		// res.header('Cache-Control', 'no-cache, max-age=0, stale-while-revalidate=300')
		// res.sendFile(path.resolve(__dirname, '..', 'views', 'dashboard.html'))
		
		res.redirect('/dashboard')
	} catch (e) {
		 res.status(400).send()
		// res.status(400).redirect('/')
	}
})

// Log out user
router.post('/logout', auth, async (req, res) => {
	try {
		req.user.tokens = []
		await req.user.save()
		await res.redirect('/')

		// Terminates user's session
		// req.session = null // delete the cookie
		// req.session.destroy() // end session after redirected to index.html
	} catch (e) {
		res.status(500).send()
	}
})

// ===== Read =====

// Reach dashboard after login or registration / Return to dashboard
router.get('/dashboard', auth, (req, res) => {
	try {
		res.sendFile(path.resolve(__dirname, '..', 'views', 'dashboard.html'))
	} catch (e) {
		res.status(500).send()
	}
})

// Get user profile
router.get('/profile', auth, (req, res) => {
	res.send({
		user: req.user,
		email: req.user.email,
		password: req.user.password
	}) // req.user.email, req.user.password
})

// ===== Update =====
router.patch('/update', async (req, res) => {

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
router.delete('/delete', async (req, res) => {

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