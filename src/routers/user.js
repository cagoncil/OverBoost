const path = require('path')
const express = require('express')
const bcrypt = require('bcryptjs') // Require bcrypt to confirm password for account deletion
const User = require('../models/user') // Require user model file
const auth = require('../middleware/auth') // Require authentication middleware file
const { sendWelcomeEmail, sendGoodbyeEmail } = require('../emails/account') // ES6 destructuring to require email code
const router = new express.Router()

// ===== Create =====
// Register new user

router.post('/welcome', async (req, res) => { 
	const user = new User(req.body)

	try {
		await user.save()
		sendWelcomeEmail(user.email)
		const token = await user.generateAuthToken()
		res.cookie('auth_token', token)
		// res.sendFile(path.resolve(__dirname, '..', 'views', 'dashboard.html'))

		// Instead of sendFile, redirect to a GET request for /dashboard to prevent resubmission of sensitive info
		res.status(201).redirect('/dashboard')
	} catch (e) { 
		//res.status(400).send(e)
		if (e.errors.email && e.errors.password) {
			res.status(400).redirect('/?' + JSON.stringify(e.errors.email.message + ' and ' + e.errors.password.message))
		} else if (e.errors.email) {
			res.status(400).redirect('/?' + JSON.stringify(e.errors.email.message))
		} else if (e.errors.password) {
			res.status(400).redirect('/?' + JSON.stringify(e.errors.password.message))
		}
		
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
		// res.status(400).send({ error: 'Error: Invalid login credentials.' })
		res.status(400).redirect('/?' + JSON.stringify('Invalid email or password.'))
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

// === Frontend page links - no authorization === 
	// Our Services
	router.get('/services', (req, res) => {
		try {
			res.render('services', {layout: 'frontend'})
		}	catch (e) {
			res.status(500).send(e)
		}
	})

	// User Reviews
	router.get('/reviews', (req, res) => {
		try {
			res.render('reviews', {layout: 'frontend'})
		}	catch (e) {
			res.status(500).send(e)
		}
	})

	// Contact Our Team
	router.get('/contact', (req, res) => {
		try {
			res.render('contactus', {layout: 'frontend'})
		}	catch (e) {
			res.status(500).send(e)
		}
	})


// === Backend page links - authorization needed === 

// Get dashboard after login or registration / Return to dashboard from another page
router.get('/dashboard', auth, (req, res) => {
	try {
		res.render('home', {layout: 'backend'}) // Set handlebar route
		// res.sendFile(path.resolve(__dirname, '..', 'views', 'dashboard.html'))
	} catch (e) {
		res.status(500).send()
	}
})

router.get('/boosters', auth, (req, res) => {
	try {
		res.render('boosters', {layout: 'backend'})
	} catch (e) {
		res.status(500).send()
	}
})

router.get('/livesupport', auth, (req, res) => {
	try {
		res.render('livesupport', {layout: 'backend'})
	} catch (e) {
		res.status(500).send()
	}
})

router.get('/orders', auth, (req, res) => {
	try {
		res.render('orders', {layout: 'backend'})
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

// Edit user account settings
router.get('/settings', auth, (req, res) => {
	res.render('settings', {layout: 'backend'})
})


// ===== Update =====
router.patch('/profile', auth, async (req, res) => {

	// console.log(req.user.password)

	const updates = Object.keys(req.body)
	const allowedUpdates = ['email', 'password', 'btag', 'server', 'name', 'oldpassword']
	const isValidOperation = updates.every((update) => allowedUpdates.includes(update)) 
	// runs code for everything in allowedUpdates array

	if (!isValidOperation) {
		return res.status(400).send({ error: 'Invalid update' })
	}

	try {

		if (updates[0] === 'email') { // Update email

			const authenticated = await bcrypt.compare(req.body.password, req.user.password)
			if (authenticated) { // If password is valid
				req.user['email'] = req.body['email'] // Only update "email" field on frontend, ignore "password" field
			} else {
				throw new Error('Password entered was invalid. Email was not updated.')
			}

		} else if (updates[0] === 'oldpassword') { // Update password

			const authenticated = await bcrypt.compare(req.body.oldpassword, req.user.password)
			if (authenticated) { // If current password (aka, the "old" password being changed) is valid
				req.user['password'] = req.body['password'] // Only update "password" field on frontend, ignore "oldpassword" field
			} else {
				throw new Error('Password entered was invalid. Password was not updated.')
			}
			
		} else { // Update other fields that aren't data-sensitive/don't require password validation
			updates.forEach((update) => req.user[update] = req.body[update])
		}
		
		await req.user.save()
		// res.send(req.user)
		res.redirect('/settings?success')
		

	} catch (e) {
		res.status(400).redirect('/settings?' + JSON.stringify('error'))
		// const updates = Object.keys(req.body)[0] // e.g. 'email'
		// res.status(400).send('Error: ' + e.errors[updates].message) 
		// res.render('settings', {layout: 'backend'})
	}

})

// ===== Delete =====
router.delete('/profile', auth, async (req, res) => {
	const authenticated = await bcrypt.compare(req.body.password, req.user.password)
	
	try {

		if (authenticated) { // If password is valid
			await req.user.remove()
			sendGoodbyeEmail(req.user.email)
			// res.send(req.user)
			res.redirect('/')
		} else {
			throw e()
		}

	} catch (e) {
		res.status(500).redirect('/settings?' + JSON.stringify('deletion'))
	}

})

module.exports = router