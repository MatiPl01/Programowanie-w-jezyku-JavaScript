const N = 40
let M = 100
const SetIntervalTime = []
const SetTimeoutTime  = []
const SetIntervalTimeDataPoints = []
const SetTimeoutTimeDataPoints  = []

const btnStartEl = document.querySelector('#btn-start')
const btnStopEl = document.querySelector('#btn-stop')
const delayInputEl = document.querySelector('#input-delay')
let isRunning = false
let interval
let timeout
let chart

window.addEventListener('load', () => {
  chart = new CanvasJS.Chart("chartContainer", {
    animationEnabled: true,
    theme: "light2",
    toolTip: {
      shared: true
    },
    title:{
      text: "Performance Chart"
    },
    axisY: {
		  title: "Average calculation time",
    },
    data: [{        
      type: "line",
      indexLabelFontSize: 16,
      name: "SetInterval",
      dataPoints: SetIntervalTimeDataPoints
    }, {        
      type: "line",
      indexLabelFontSize: 16,
      name: "SetTimeout",
      dataPoints: SetTimeoutTimeDataPoints
    }]
  })

  chart.render()
})

const doTimeConsumingCalculationsWithSetInterval = () => {
  interval = setInterval(() => {
    doTimeConsumingCalculations(SetIntervalTime)
    doTimeConsumingCalculationsWithSetInterval()
  }, M)
}

const doTimeConsumingCalculationsWithSetTimeout = () => {
  timeout = setTimeout(() => {
    doTimeConsumingCalculations(SetTimeoutTime)
    if (isRunning) doTimeConsumingCalculationsWithSetTimeout()
  }, M)
}

const doTimeConsumingCalculations = arr => {
  arr.push(performance.now())
  if (arr.length > N) arr.shift()
  calculatePrimes(50, 1000000000)
}

const calculatePrimes = (iterations, multiplier) => {
  var primes = [];
  for (var i = 0; i < iterations; i++) {
    var candidate = i * (multiplier * Math.random());
    var isPrime = true;
    for (var c = 2; c <= Math.sqrt(candidate); ++c) {
      if (candidate % c === 0) {
          // not prime
          isPrime = false;
          break;
       }
    }
    if (isPrime) {
      primes.push(candidate);
    }
  }
  return primes;
}

const start = () => {
  isRunning = true
  M = +delayInputEl.value
  if (10 <= M && M <= 10000) {
    doTimeConsumingCalculationsWithSetInterval(M)
    doTimeConsumingCalculationsWithSetTimeout(M)
    requestAnimationFrame(drawChart)
  } else {
    alert('Delay should be between 10 and 10000 ms')
  }
}

const stop = () => {
  isRunning = false
  if (interval) clearInterval(interval)
  if (timeout)  clearTimeout(timeout)
}

const calcAvgDiff = arr => {
  if (arr.length == 0) return 0
  if (arr.length == 1) return arr[0]
  const n = arr.length - 1
  let sum = 0
  for (let i = 0; i < n - 1; i++) sum += (arr[i + 1] - arr[i])
  const avg = sum / (n - 1)
  return isNaN(avg) ? 0 : avg
}

let i = 0
const addAvgDiff = (timeArr, avgArr) => {
  avgArr.push({
    x: i++,
    y: calcAvgDiff(timeArr)
  })
  if (avgArr.length > N) avgArr.shift()
}

const drawChart = () => {
  addAvgDiff(SetIntervalTime, SetIntervalTimeDataPoints)
  addAvgDiff(SetTimeoutTime, SetTimeoutTimeDataPoints)
  console.log(SetTimeoutTime)
  chart.render()
  if (isRunning) requestAnimationFrame(drawChart)
}


btnStartEl.addEventListener('click', start)
btnStopEl.addEventListener('click', stop)
