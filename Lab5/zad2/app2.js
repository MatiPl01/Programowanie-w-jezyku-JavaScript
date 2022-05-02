// Application using the 'Pug' template system
const express = require('express')
const logger = require('morgan');
const fs = require('fs');

const compute = require('./lib/compute');

const app = express();

const x = 1;
const y = 2;

// Configuring the application
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

// Determining the contents of the middleware stack
app.use(logger('dev'));

// Route definitions
app.get('/', function (req, res) { 
  res.render('index', { pretty: true, x, y });
});

app.get('/json/:name', function (req, res) {
  const { name } = req.params;
  const path = `./json/${name}.json`;
  let data;

  try {
    data = fs.readFileSync(path);
  } catch {
    return res.status(404).send(`<h1>File ${path} was not found</h1>`);
  }

  const json = JSON.parse(data);
  const computed = compute(json);
  res.render('table', { pretty: true, computed });
});

// The application is to listen on port number 3000
app.listen(3000, function () {
  console.log('The application is available on port 3000');
});


module.exports = {
  x, y
};
