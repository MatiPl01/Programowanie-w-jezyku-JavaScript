// No use of any template system
const express = require('express');
const logger = require('morgan');
const fs = require('fs');

const compute = require('./lib/compute');
const table = require('./lib/table');

const app = express();

const x = 1;
const y = 2;

// Determining the contents of the middleware stack
app.use(logger('dev'));

// Route definitions
app.get('/', (req, res) => {     
  res.send(`${x} + ${y} = ${x + y}`);
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
  const headers = ['x', 'Operation', 'y', 'Result'];
  const computed = compute(json);
  res.status(200).send(table.createTable(
    headers, 
    computed.map(({ x, op, y, result }) => [x, op, y, result])
    ));
});

// The application is to listen on port number 3000
app.listen(3000, function () {
  console.log('The application is available on port 3000');
});


module.exports = {
  x, y
};
