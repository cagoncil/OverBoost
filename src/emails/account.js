const sgMail = require('@sendgrid/mail')

const sendgridAPIKey = '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'

sgMail.setApiKey(sendgridAPIKey)

sgMail.send({
	to: 'crystallophobia@gmail.com',
	from: 'crystallophobia@gmail.com',
	subject: 'Howdy Hey Howdy Ho',
	text: 'I hope this one actually gets to you'
})