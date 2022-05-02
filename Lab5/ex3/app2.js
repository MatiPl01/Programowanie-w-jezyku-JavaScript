// Application using the 'Pug' template system
require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const logger = require('morgan');
const fs = require('fs');

const Operation = require('./models/operation.model');
const { compute, calc, operation } = require('./lib/compute');

const x = 1;
const y = 2;


// Create the server
const app = express();

// Connect to the database
mongoose.connect(process.env.MONGO_PATH)
  .then(() => console.log("🚀 Database was successfully connected"))
  .catch(err => console.log(`💥 Cannot connect to the database.\n${err}`));

// Configuring the application
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

// Determining the contents of the middleware stack
app.use(logger('dev'));


// Route definitions
app.get('/', function (req, res) { 
  res.render('index', { pretty: true, x, op: '+', y, result: x + y });
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

app.get('/calculate/:operation/:x/:y', (req, res) => {
  let { operation: op, x, y } = req.params;
  x = +x;
  y = +y;
  op = operation(op);

  const result = calc(x, op, y);
  Operation.create({ x, y, op, result });

  res.render('index', { pretty: true, x, op, y, result });
})

app.get('/results', async (req, res) => {
  res.render('table', { pretty: true, computed: await Operation.find() });
})

// The application is to listen on port number 3000
app.listen(3000, function () {
  console.log('The application is available on port 3000');
});


module.exports = {
  x, y
};
