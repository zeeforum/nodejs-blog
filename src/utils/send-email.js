const Email = require('email-templates')

const sendEmail = async (user, data) => {
	const email = new Email({
		message: {
			from: {
				"address": "no-reply@example.com",
				"name": "Blogger"
			}
			// name: "Blogger"
		},
		send: true,
		preview: false,
		transport: {
			host: "127.0.0.1",
			port: 1025,
			ssl: false,
			tls: true
		}
	})

	const response = await email.send({
		template: "forgot-password",
		message: {
			to: {
				address: user.email,
				name: user.name
			}
		},
		locals: data
	})

	console.log(response)
}

module.exports = sendEmail