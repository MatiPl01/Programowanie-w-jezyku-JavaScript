// No use of any template system
const express = require('express'), logger = require('morgan');
const app = express();

const x = 1;
const y = 2;

// Determining the contents of the middleware stack
app.use(logger('dev'));                         // Place an HTTP request recorder on the stack — each request will be logged in the console in 'dev' format
// app.use(express.static(__dirname + '/public')); // Place the built-in middleware 'express.static' — static content (files .css, .js, .jpg, etc.) will be provided from the 'public' directory

// Route definitions
app.get('/', function (req, res) {     // The first route
  res.send(`${x} + ${y} = ${x + y}`); // Send a response to the browser
});

// The application is to listen on port number 3000
app.listen(3000, function () {
  console.log('The application is available on port 3000');
});
