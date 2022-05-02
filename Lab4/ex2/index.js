import { checkEntityType, printFile } from './module.js';

const path = process.argv[2];
const type = checkEntityType(path);
console.log(`Entity is a ${type}`);
if (type === 'file') {
  console.log('File contents:')
  printFile(path);
}

// node . dir           - Entity is a directory
// node . dir/file.txt  - Entity is a file
