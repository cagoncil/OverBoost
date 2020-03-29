// ======================================================
// ======================= SERVER ======================= 
// ======================================================

const express = require('express') // Initialize the express server
require('./db/mongoose') // Require mongoose file to ensure file runs and mongoose connects to database
const cookieParser = require('cookie-parser') // Use cookies to store the JSON web tokens on the frontend
const User = require('./models/user') // Load user model module into the app
const userRouter = require('./routers/user') // Load user router module into the app

const app = express()
const port = process.env.PORT || 3000 // heroku port || localhost

// ======== Middleware ========
app.use('/static', express.static(path.join(__dirname, 'public')))
//app.use(express.static('public')) // Serves static files (images, css, js...) on the frontend
app.use(express.json()) // Recognizes incoming req.object from a POST request as a JSON object
app.use(express.urlencoded({ extended: false })) // Parses data sent via forms from the frontend
app.use(cookieParser()) // Parses cookies sent with the forms from the frontend
app.use(userRouter) // Uses the router module

// Maintenance Mode
// app.use((req, res, next) => {
// 	res.status(503).send('Sorry, our server is temporarily down for scheduled maintenance.')
// })

app.listen(port, () => {
	console.log('Server is up on port ' + port)
})


