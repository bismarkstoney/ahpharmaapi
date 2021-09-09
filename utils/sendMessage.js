const dotenv = require('dotenv');
dotenv.config({ path: './config/config.env' });
ACCOUNT_SID = 'AC6950daba371faab48691830a2344a180';
AUTH_TOKEN = '9d471d0316ddf1082ac0e322a7f83ed8';
SERVICE_SID = 'ISea746b1aece9cf9d4f65cbb8504ada63';
const client = require('twilio')(ACCOUNT_SID, AUTH_TOKEN);

// User-defined function to send bulk SMS to desired
// numbers bypassing numbers list as parameter
function sendBulkMessages(messageBody, numberList) {
	var numbers = [];
	for (i = 0; i < numberList.length; i++) {
		numbers.push(
			JSON.stringify({
				binding_type: 'sms',
				address: numberList[i],
			})
		);
	}

	const notificationOpts = {
		toBinding: numbers,
		body: messageBody,
	};

	client.notify
		.services(SERVICE_SID)
		.notifications.create(notificationOpts)
		.then((notification) => console.log(notification.sid))
		.catch((error) => console.log(error));
}

// Sending our custom message to all numbers
// mentioned in array.
// sendBulkMessages(
// 	`Dear pharma,  am at alex house you're kindly reminded of your monthly refill of your medication. Call us on 0242389831 to
// have it delivered at no extra cost`,
// 	['+233242187405']
// ); // Example +919999999999
module.exports = sendBulkMessages;
