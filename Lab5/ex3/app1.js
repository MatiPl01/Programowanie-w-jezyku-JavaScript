// No use of any template system
require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const logger = require('morgan');
const fs = require('fs');

const Operation = require('./models/operation.model');
const { compute, calc, operation } = require('./lib/compute');
const table = require('./lib/table');

const x = 1;
const y = 2;


// Create the server
const app = express();

const renderResults = (res, results) => {
  const headers = ['x', 'Operation', 'y', 'Result'];

  res.status(200).send(table.createTable(
    headers, 
    results.map(({ x, op, y, result }) => [x, op, y, result])
  ));
}

// Connect to the database
mongoose.connect(process.env.MONGO_PATH)
  .then(() => console.log("🚀 Database was successfully connected"))
  .catch(err => console.log(`💥 Cannot connect to the database.\n${err}`));

// Determining the contents of the middleware stack
app.use(logger('dev'));


// Route definitions
app.get('/', (req, res) => {     
  res.status(200).send(`${x} + ${y} = ${x + y}`);
});

app.get('/json/:name', (req, res) => {
  const { name } = req.params;
  const path = `./json/${name}.json`;
  let data;

  try {
    data = fs.readFileSync(path);
  } catch {
    return res.status(404).send(`<h1>File ${path} was not found</h1>`);
  }

  const json = JSON.parse(data);
  renderResults(res, compute(json));
});

app.get('/calculate/:operation/:x/:y', (req, res) => {
  let { operation: op, x, y } = req.params;
  x = +x;
  y = +y;
  op = operation(op);
  
  const result = calc(x, op, y);
  Operation.create({ x, y, op, result });

  res.status(200).send(`<h1>${x} ${op} ${y} = ${result}</h1>`);
})

app.get('/results', async (req, res) => {
  renderResults(res, await Operation.find());
})

// The application is to listen on port number 3000
app.listen(3000, function () {
  console.log('The application is available on port 3000');
});


module.exports = {
  x, y
};
