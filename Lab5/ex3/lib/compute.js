const calc = (x, op, y) => {
  switch (op) {
    case '+':
      return x + y;
    case '-':
      return x - y;
    case '*':
      return x * y;
    case '/':
      return x / y;
    case '%':
      return x % y;
    default:
      throw new Error(`Unrecognized operation ${op}`);
  }
}

const compute = operations => {
  return operations.map(({ x, op, y }) => {
    return {
      x, 
      op, 
      y, 
      result: calc(x, op, y)
    };
  })
}

const operation = operationName => {
  switch (operationName) {
    case 'add':
      return '+';
    case 'sub':
      return '-';
    case 'mul':
      return '*';
    case 'div':
      return '/';
    case 'mod':
      return '%';
    default:
      throw new Error(`Unrecognized operation name ${operationName}`);
  }
}


module.exports = {
  calc,
  compute,
  operation
};
