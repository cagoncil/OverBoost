// ======================================================
// ======================= SERVER ======================= 
// ======================================================
const path = require('path') // Needed to get views path inside 'src' folder
const express = require('express') // Initialize the express server
require('./db/mongoose') // Require mongoose file to ensure file runs and mongoose connects to database
const exphbs  = require('express-handlebars') // Register a Handlebars view engine
const cookieParser = require('cookie-parser') // Use cookies to store the JSON web tokens on the frontend
const methodOverride = require('method-override') // Allows HTML forms to process PATCH/DELETE requests
const User = require('./models/user') // Load user model module into the app
const userRouter = require('./routers/user') // Load user router module into the app

const app = express()
const port = process.env.PORT || 3000 // heroku port || localhost

// ======== Middleware ========
app.use(express.json()) // Recognizes incoming req.object from a POST request as a JSON object
app.use(express.urlencoded({ extended: false })) // Parses data sent via forms from the frontend
app.use(cookieParser()) // Parses cookies sent with the forms from the frontend
app.use(methodOverride('_method')) // Allows HTML forms to process PATCH/DELETE requests
app.engine('.hbs', exphbs({extname: '.hbs'})) // Setup handlebars engine, uses .hbs extension
app.set('view engine', '.hbs')
app.set('views', path.join(__dirname, './views')) // Setup handlebars views location
app.use(express.static('public')) // Serves static files (images, css, js...) on the frontend
app.use(userRouter) // Uses the router module


// Maintenance Mode
// app.use((req, res, next) => {
// 	res.status(503).send('Sorry, our server is temporarily down for scheduled maintenance.')
// })

app.listen(port, () => {
	console.log('Server is up on port ' + port)
})