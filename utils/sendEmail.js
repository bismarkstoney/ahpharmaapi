const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
	const transporter = nodemailer.createTransport({
		host: process.env.SMPT_HOST,
		port: process.env.SMPT_PORT,
		//secure: false, // true for 465, false for other ports
		auth: {
			user: process.env.SMPT_EMAIL,
			pass: process.env.SMPT_PASSWORD,
		},
	});

	// send mail with defined transport object
	const message = await transporter.sendMail({
		from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}`, // sender address
		to: options.email, // list of receivers
		subject: options.subject, // Subject line
		text: options.message, // plain text body
	});

	const info = await transporter.sendMail(message);

	console.log('Message sent: %s', info.messageId);
	// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
};

module.exports = sendEmail;
