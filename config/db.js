const mongoose = require('mongoose');

const databaseConnection = async () => {
	const con = await mongoose.connect(process.env.DATABASE, {
		useCreateIndex: true,
		useFindAndModify: false,
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
	console.log(`the database is connected on ${con.connection.host}`);
};

module.exports = databaseConnection;
