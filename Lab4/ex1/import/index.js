import { Operation } from './module.js';

const [x, y] = process.argv.slice(2);
console.log(new Operation(+x, +y).sum());
