import fs from 'fs';


export const checkEntityType = path => {
  try {
    const stats = fs.lstatSync(path);
    if (stats.isFile()) return 'file';
    if (stats.isDirectory()) return 'directory';
    return 'other';
  } catch (e) {
    console.error(`Entity ${path} does't exist`)
    return null;
  }
}


export const printFile = path => {
  const content = fs.readFileSync(path, {encoding: 'utf8', flag: 'r'});
  console.log(content);
}
