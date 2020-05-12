const sgMail = require('@sendgrid/mail')

const overboostEmail = 'noreply.overboost@gmail.com'

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

// sgMail.send({
// 	to: overboostEmail,
// 	from: overboostEmail,
// 	subject: 'Welcome to OverBoost',
// 	text: `Thank you for registering your account with us on OverBoost.`
// })

const sendWelcomeEmail = (email) => {
	sgMail.send({
		to: email,
		from: overboostEmail,
		subject: 'Welcome to OverBoost!',
		text: `Thank you for registering your account (user: ${email}) with us on OverBoost.`,
		html: 	`<p>Dear <strong>${email}</strong>, <br></p>
				Thank you for registering your account with us on <strong><a href="https://overwatchboosting.herokuapp.com" target="_blank">OverBoost</a></strong>. <br>
				Once you add your personal details to your <a href="https://overwatchboosting.herokuapp.com/settings" target="_blank">account settings</a>, you're ready to start boosting! <br>
				Be sure to use the code <strong><em>GG2020</strong></em> to take <strong>20% off</strong> your first order. <br>

				<p>We look forward to working with you to achieve your goals!</p>

				Sincerely, <br>
				The OverBoost Team<br>

				<p><em>This email is an automatic generated message. Please do not reply as emails are not monitored.<br>
						For assistance, please contact our Live Support team on https://overwatchboosting.herokuapp.com.<br></em></p>
				`
	})
}

const sendGoodbyeEmail = (email) => {
		sgMail.send({
		to: email,
		from: overboostEmail,
		subject: `We're sorry to see you go!`,
		text: `Your account on OverBoost has been successfully deleted.`,
		html: 	`<p>Dear <strong>${email}</strong>, <br></p>

				Your account on OverBoost has been successfully deleted.

				<p>If you didn't close your OverBoost account, please let us know by clicking this <a href="https://overwatchboosting.herokuapp.com/contact" target="_blank">link</a>.</p>

				Sincerely, <br>
				The OverBoost Team<br>

				<p><em>This email is an automatic generated message. Please do not reply as emails are not monitored.<br>
						For assistance, please contact our Live Support team on https://overwatchboosting.herokuapp.com.<br></em></p>
				`
	})
}

module.exports = { // export multiple objects
	sendWelcomeEmail, // ES6 shorthand syntax
	sendGoodbyeEmail
}