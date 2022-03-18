"use strict";

const numbers = str => {
  return [...str]
    .filter(c => !isNaN(c))
    .reduce((acc, v) => acc + +v, 0)
}

const letters = str => {
  return [...str].filter(c => isNaN(c)).length
}

const sumInit = () => {
  let totalSum = 0

  return str => {
    if (str.length && !isNaN(str[0])) {
      const digitsSum = numbers(str)
      totalSum += digitsSum
    }
    return totalSum
  }
}

const sum = sumInit()

while (true) {
  const ans = window.prompt('Please provide some input containing numbers and letters')
  if (ans === null) break
  const digitsSum = numbers(ans)
  const noLetters = letters(ans)
  const totalSum = sum(ans)
  console.log(`${ans}\n\t%c${digitsSum}\t%c${noLetters}\t%c${totalSum}`, 'color: red', 'color: green', 'color: #0a99fa')
}
