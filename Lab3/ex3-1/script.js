const formEl = document.querySelector('form')
const inputEl = document.getElementById('number-input')
const spanElList = document.getElementsByTagName('span')

let reset = false
let counter = +inputEl.value
const INTERVAL = 1000

const updateSpans = value => {
  for (const spanEl of spanElList) {
    // spanEl.childNodes[0].textContent = value
    
    const text = document.createTextNode(value)
    spanEl.childNodes[0].replaceWith(text)
  }
}

setInterval(() => {
  if (counter > 0) counter--
  if (!counter && !reset) {
    reset = true
    inputEl.value = counter
  }
  updateSpans(counter)

}, INTERVAL)

formEl.addEventListener('submit', e => {
  e.preventDefault()
  counter = +inputEl.value
  updateSpans(counter)
  reset = false
})
