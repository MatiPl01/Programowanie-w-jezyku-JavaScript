/** Class used to perform math operation */
export class Operation {
  /**
   * @constructor
   * @param {number} x
   * @param {number} y 
   */
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  /**
   * @desc Adds two numbers
   * @returns {number} - sum of x and y
   */
  sum() {
    return this.x + this.y;
  }
}
