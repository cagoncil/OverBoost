const sgMail = require('@sendgrid/mail')

let sendgridAPIKey

sgMail.setApiKey(sendgridAPIKey)

sgMail.send({
	to: 'noreply.overboost@gmail.com',
	from: 'noreply.overboost@gmail.com',
	subject: 'Howdy Hey Howdy Ho',
	text: 'I hope this one actually gets to you'
})