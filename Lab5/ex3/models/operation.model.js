const { Schema, model } = require('mongoose');


const operationSchema = new Schema(
  {
    x: {
      type: Number,
      required: [true, 'Please provide x value']
    },

    y: {
      type: Number,
      required: [true, 'Please provide y value']
    },

    op: {
      type: String,
      enum: [
        '+',
        '-',
        '*',
        '/',
        '%'
      ]
    },

    result: {
      type: Number,
      required: [true, 'Please provide operation result']
    }
  }
)


module.exports = model('Operation', operationSchema);
