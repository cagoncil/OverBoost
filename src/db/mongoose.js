// Connect to MongoDB database

const mongoose = require('mongoose')
const connectionURL = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/overboost'

mongoose.connect(connectionURL, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true,
	useFindAndModify: false
})