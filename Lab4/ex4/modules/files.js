import { checkEntityType, readFile } from './module.js';
import fs from 'fs';
import path from 'path';


export default class Files {
  static MAX_WIDTH = 40;

  static async recursive(dir) { // TODO - i don't know how to detect a binary file
    if (!dir) return;
    console.log(`\nEntering '${dir}' directory...`);

    fs.readdir(dir, (err, entities) => {
      if (err) throw err;

      entities.forEach(entity => {
        const entityPath = path.join(dir, entity);

        checkEntityType(entityPath, type => {
          switch (type) {
            case 'file':
              Files.right(entityPath);
              break;
            case 'directory':
              Files.recursive(entityPath);
              break;
            default:
              console.log(`Skipping unrecognized entity: '${entityPath}'`);
          }
        });
      });
    });
  }

  static right(entityPath) {
    readFile(entityPath, (err, text) => {
      if (err) throw err;

      const words = text.trim().split(/\s+/);
      const lines = []

      let line = [];
      let lineLength = -1; // Start from -1 because there will be one space less than the number of words

      words.forEach(word => {
        if (lineLength + word.length + 1 > Files.MAX_WIDTH) {
          lines.push(line.join(' ').padStart(Files.MAX_WIDTH));

          line = [];
          lineLength = -1;
        }

        lineLength += word.length + 1; // Add space to the total line length
        line.push(word);
      })

      if (lineLength) lines.push(line.join(' ').padStart(Files.MAX_WIDTH));
      
      console.log(`\n📒 '${entityPath}' file justed to the right:`)
      console.log(lines.join('\n'));
    })
  }

  static info() {
    // TODO - i don't know how to detect a binary file
  }
}
