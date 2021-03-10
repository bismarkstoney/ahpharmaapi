const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const databaseConnection = require('./config/db');
const clientRouter = require('./routes/clientRouter');
const phamarcyRouter = require('./routes/phamarcyRouter');
const teamRouter = require('./routes/teamRouter');
dotenv.config({ path: './config/config.env' });

const app = express();
app.use(express.json());
databaseConnection();
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}
app.use('/api/v1/clients', clientRouter);
app.use('/api/v1/phamarcy', phamarcyRouter);
app.use('/api/v1/teams', teamRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`The server is running on ${PORT} in ${process.env.NODE_ENV} `);
});
