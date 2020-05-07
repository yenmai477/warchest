const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const path = require('path');
const productRouter = require('./routes/productRoutes');

dotenv.config('.env');

const app = express();

//Set template engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '/views'));

// 1) GLOBAL MIDDLEWARES

// parse application/json
app.use(bodyParser.json());

// parse urlencoded request bodies into req.body
app.use(bodyParser.urlencoded({ extended: true }));

//Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// 2) ROUTES
app.get('/', (req, res) => {
  return res.send('Hello world!');
});

app.use('/api/v1/products', productRouter);

module.exports = app;
