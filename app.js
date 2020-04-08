const express = require('express');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config('.env');

const app = express();

//Set template engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '/views'));

// 1) GLOBAL MIDDLEWARES

//Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// 2) ROUTES
app.get('/', (req, res) => {
  return res.send('Hello world!');
});

module.exports = app;
