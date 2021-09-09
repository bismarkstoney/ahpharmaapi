const twilio = require('twilio');

const accountSid = process.env.ACCOUNTSID;
const authToken = process.env.AUTHTOKEN;

module.exports = new twilio.Twilio(accountSid, authToken);
