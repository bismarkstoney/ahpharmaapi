const express = require('express');

const path = require('path');
const dotenv = require('dotenv');
const morgan = require('morgan');
const multer = require('multer');
const upload = multer();
const cors = require('cors');
const formidable = require('formidable');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const databaseConnection = require('./config/db');
const clientRouter = require('./routes/clientRouter');
const phamarcyRouter = require('./routes/phamarcyRouter');
const categoryRouter = require('./routes/categoryRouter');
const feedbackRouter = require('./routes/feebackRouter');
const teamRouter = require('./routes/teamRouter');
const authRouter = require('./routes/authRouter');
const client = require('./utils/twilio');
const tipsRouter = require('./routes/tipsRouter');
const postRouter = require('./routes/postRouter');
const drugRouter = require('./routes/drugRouter');
const drugExpires = require('./routes/drugExpires');
const ratingRouter = require('./routes/ratingRouter');

const errorHandler = require('./middleware/error');
const sendBulkMessages = require('./utils/sendMessage');
dotenv.config({ path: './config/config.env' });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// for parsing multipart/form-data
//app.use(formidable());

//cookie
app.use(cookieParser());
databaseConnection();
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}
app.use(compression());
app.use(cors());
app.options('*', cors());
//app.use(fileupload());
//app.use(upload.single());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('uploads'));
app.use('/api/v1/clients', clientRouter);
app.use('/api/v1/phamarcy', phamarcyRouter);
app.use('/api/v1/teams', teamRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/posts', postRouter);
app.use('/api/v1/categories', categoryRouter);
app.use('/api/v1/contact', feedbackRouter);
app.use('/api/v1/drugs', drugRouter);
app.use('/api/v1/tips', tipsRouter);
app.use('/api/v1/drugexpires', drugExpires);
app.use('/api/v1/rating', ratingRouter);

app.use(errorHandler);

app.listen(PORT, () => {
	console.log(`The server is running on ${PORT} in ${process.env.NODE_ENV} `);
});
