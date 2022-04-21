const { Operation } = require('./module')

const [x, y] = process.argv.slice(2);
console.log(new Operation(+x, +y).sum());
