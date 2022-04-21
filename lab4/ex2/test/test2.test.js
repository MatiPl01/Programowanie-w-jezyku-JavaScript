import { checkEntityType } from '../module.js';
import assert from 'assert';

// npx mocha .  - use this command to run tests
describe('Test if checkEntityType function returns a correct entity type', () => {
  it("Should return 'directory' for a directory entity", () => {
    assert.strictEqual(checkEntityType('dir'), 'directory');
  })
  it("Should return 'file' for a file entity", () => {
    assert.strictEqual(checkEntityType('dir/file.txt'), 'file');
  })
  it("Should return 'error' if entity doesn't exist", () => {
    assert.strictEqual(checkEntityType('dir/file123.txt'), null);
  })
})
