const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const databaseConnection = require('./config/db');
const clientRouter = require('./routes/clientRouter');
dotenv.config({ path: './config/config.env' });

const app = express();
app.use(express.json());
databaseConnection();
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}
app.use('/api/v1/clients', clientRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`The server is running on ${PORT} in ${process.env.NODE_ENV} `);
});
