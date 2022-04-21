const showAlertAndLog = () => {
  console.log('Tekst 1')
  window.alert('Tekst 2')
}

const logInput = () => {
  const elements = document.forms[0].elements
  const text = elements[0].value
  const number = +elements[1].value
  console.log(`Wartość pola tekstowego: ${text} (typ: ${typeof text})
Wartość pola liczbowego: ${number} (typ: ${typeof number})`)
}

(() => {
  const response = window.prompt("Wpisz coś:")
  console.log(`Wpisana wartość: ${response}\nTyp wartości: ${typeof response}`)

  showAlertAndLog()

  document.querySelector('input[type="button"]').addEventListener('click', logInput)
})()
