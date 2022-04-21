"use strict";


const FPS = 60
const defaultStyles = {}
const animations = {}

const $ = (selector, callback) => {
  selector.split(/\s*,\s*/).forEach(s => {
    document.querySelectorAll(s).forEach(el => {
      callback(el, selector)
    })
  })
}

const setStyle = (selector, styleObj) => {
  let previousStyleObj = {}

  $(selector, el => {
    Object.entries(styleObj).forEach(([property, value]) => {
      previousStyleObj[property] = el.style[property]
      el.style[property] = value
      if (!(el in defaultStyles)) defaultStyles[selector] = previousStyleObj
    })
  })

  return previousStyleObj
}

const unsetStyle = (selector, styleObj, previousStyleObj={}) => {
  $(selector, el => {
    Object.keys(styleObj).forEach(property => {
      if (property in previousStyleObj) {
        el.style[property] = previousStyleObj[property]
      } else el.style.removeProperty(property)
    })
  })
}

// const media = mediaQueryString => (selector, styleObj) => {
//   let previousStyleObj = {}
//   let isApplied = false

//   const updateMedia = () => {
//     if (window.matchMedia(mediaQueryString).matches) {
//       if (!isApplied) {
//         isApplied = true
//         previousStyleObj = setStyle(selector, styleObj)
//       }
//     } else if (isApplied) {
//       isApplied = false
//       unsetStyle(selector, styleObj, previousStyleObj)
//     }
//   }

//   if (window.matchMedia(mediaQueryString).matches) updateMedia()
//   window.addEventListener('resize', updateMedia)
// }

// const respondPhone      = media('only screen and (max-width: 37.5em)')
// const respondTabletPort = media('only screen and (max-width: 56.25em)')
// const respondTabletLand = media('only screen and (max-width: 75em)')
// const respondBigDesktop = media('only screen and (min-width: 112.5em)')

const removeStyleSheet = () => {
  Object.entries(defaultStyles).forEach(([selector, styleObj]) => {
    setStyle(selector, styleObj)
  })
  Object.values(animations).forEach(obj => obj.clear())
}

const loadStyleSheet = () => {
  setStyle('html', {
    'font-size': '62.5%',
  })

  // respondTabletLand('html', { 'font-size': '56.25%' })
  // respondTabletPort('html', { 'font-size': '50%' })
  // respondBigDesktop('html', { 'font-size': '75%' })

  setStyle('h1, h2', {
    margin: 0
  })

  setStyle('body', {
    'font-size': '1.6rem',
    padding: '1rem'
  })

  setStyle('body > *', {
    'margin-bottom': '1rem'
  })

  setStyle('header', {
    'padding': '.5rem'
  })

  setStyle('nav', {
    'width': 'max-content',
    'float': 'left',
    'padding-right': '.75rem'
  })

  setStyle('aside', {
    'float': 'right',
    'width': '50%',
    'padding': '.75rem'
  })

  setStyle('main', {
    'clear': 'left',
    'padding': '.75rem .75rem 3rem .75rem',
    'width': 'max-content'
  })

  setStyle('main blockquote', {
    'margin': 0
  })

  setStyle('main h1', {
    'margin-bottom': '1rem'
  })

  setStyle('main blockquote p', {
    'font-family': 'monospace',
    'margin': 0
  })

  setStyle('footer', {
    'padding': '.75rem'
  })

  setStyle('.azure', {
    'background-color': '#f0ffff'
  })

  setStyle('.border', {
    'border': '1px solid black'
  })

  setStyle('.shadow', {
    'box-shadow': '0 0 .5rem rgba(0, 0, 0, .5)'
  })

  // respondPhone('body', {
  //   'display': 'flex',
  //   'flex-direction': 'column'
  // })

  // respondPhone(`
  //   header,
  //   nav,
  //   aside,
  //   main, 
  //   footer`, {
  //     'width': '100%',
  //     'float': 'none',
  //     'box-sizing': 'border-box'
  //   }
  // )

  $('aside h1', (el, selector) => {
    const color1 = [255, 0, 0]
    const color2 = [0, 0, 255]
    const duration = 2

    const defaultColor = el.style.color
    const colorDelta = color1.map((c1, i) => color2[i] - c1)
    const steps = duration * FPS
    let direction = 1
    let step = 1
    let currColor = color1.slice()

    animations[selector] = {
      interval: setInterval(() => {
        if (step === 0 || step === steps) direction = !direction

          currColor = color1.map((c1, i) => c1 + (step / steps) * colorDelta[i])
          if (direction) step++;
          else step--;
          
          el.style.color = `rgb(${currColor[0]}, ${currColor[1]}, ${currColor[2]})`
        }, 
      1000 / FPS),

      clear: function() {
        clearInterval(this.interval)
        el.style.color = defaultColor
      }
    }
  })
}
