const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const path = require('path');

const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const userRouter = require('./routes/userRoutes');
const cronJobRouter = require('./routes/cronjobRoutes');
const productRouter = require('./routes/productRoutes');

dotenv.config('.env');

const app = express();

//Set template engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '/views'));

// 1) GLOBAL MIDDLEWARES

// // parse application/json
// app.use(bodyParser.json());

// // parse urlencoded request bodies into req.body
// app.use(bodyParser.urlencoded({ extended: true }));

//Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Set security HTTP headers
app.use(helmet());

// Limit requests from same IP
const limiter = rateLimit({
  max: 200,
  windowMs: 15 * 60 * 1000,
  handler: (req, res, next) => {
    if (req.rateLimit.remaining <= 0) {
      return next(
        new AppError(
          'Too many requests from this IP, please try again in 15 minutes!',
          429
        )
      );
    }
    next();
  },
});

app.use('/api', limiter);

//Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
app.use(cors());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

app.use(compression());

// 2) ROUTES
app.get('/', (req, res) => {
  return res.send('Hello world!');
});

app.use('/api/v1/products', productRouter);
app.use('/api/v1/crons', cronJobRouter);
app.use('/api/v1/users', userRouter);

//Check Unhandled Routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

//Global Error handler
app.use(globalErrorHandler);

module.exports = app;
