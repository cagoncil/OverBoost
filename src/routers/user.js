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
		// res.sendFile(path.resolve(__dirname, '..', 'views', 'dashboard.html'))

		// Instead of sendFile, redirect to a GET request for /dashboard to prevent resubmission of sensitive info
		res.status(201).redirect('/dashboard')
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
		
		// Instead of sendFile, redirect to a GET request for /dashboard to prevent resubmission of sensitive info
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

		// Terminates user's session - seems unnecessary for now, but here just in case
			// req.session = null // deletes the cookie
			// req.session.destroy() // ends session after redirected to index.html
	} catch (e) {
		res.status(500).send()
	}
})

// ===== Read =====

// Get dashboard after login or registration / Return to dashboard from another page
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
		user: req.user
	}) // req.user.email, req.user._id
})

// ===== Update =====
router.patch('/profile', auth, async (req, res) => {

	const updates = Object.keys(req.body)
	const allowedUpdates = ['email', 'password']
	const isValidOperation = updates.every((update) => allowedUpdates.includes(update)) 
	// runs code for everything in allowedUpdates array

	if (!isValidOperation) {
		return res.status(400).send({ error: 'Invalid update' })
	}

	try {
		updates.forEach((update) => req.user[update] = req.body[update])
		await req.user.save()
		res.send(req.user)
	} catch (e) {
		res.status(400).send(e)
	}

})

// ===== Delete =====
router.delete('/profile', auth, async (req, res) => {

	try {
		await req.user.remove()
		res.send(req.user)

	} catch (e) {
		res.status(500).send(e)
	}

})

module.exports = router