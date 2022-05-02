import fs from 'fs';


export const checkEntityType = (path, callback) => {
  let type;
 
  fs.lstat(path, (err, stats) => {
    if (err) {
      console.error(`Entity '${path}' does't exist`);
      type = 'error';
    } else {
      if (stats.isFile()) type = 'file';
      else if (stats.isDirectory()) type = 'directory';
      else type = 'other';
    }
    callback(type);
  });
}


export const readFile = (path, callback) => {
  return fs.readFile(path, {encoding: 'utf8', flag: 'r'}, callback);
}
