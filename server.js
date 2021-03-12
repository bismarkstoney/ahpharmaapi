const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const morgan = require('morgan');
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const databaseConnection = require('./config/db');
const clientRouter = require('./routes/clientRouter');
const phamarcyRouter = require('./routes/phamarcyRouter');
const teamRouter = require('./routes/teamRouter');
const authRouter = require('./routes/authRouter');
const errorHandler = require('./middleware/error');
dotenv.config({ path: './config/config.env' });

const app = express();
app.use(express.json());
//cookie
app.use(cookieParser());
databaseConnection();
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

app.use(fileupload());

app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/v1/clients', clientRouter);
app.use('/api/v1/phamarcy', phamarcyRouter);
app.use('/api/v1/teams', teamRouter);
app.use('/api/v1/auth', authRouter);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`The server is running on ${PORT} in ${process.env.NODE_ENV} `);
});
