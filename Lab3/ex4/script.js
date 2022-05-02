"use strict";

/**
 * CONSTANTS
 */
const PLUS = 'plus';
const MINUS = 'minus';
const WORD = 'word';
const NUMBER = 'number';

const TYPES = [PLUS, MINUS, WORD, NUMBER];

const WORDS = `
Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos enim architecto porro aperiam tempore reprehenderit similique est recusandae facere blanditiis eius labore error nam explicabo harum, aliquam molestias cumque maiores voluptates temporibus. Quae ipsam fugiat laborum soluta ex culpa, eaque doloribus exercitationem. Unde quos quaerat molestiae delectus, ullam quas eveniet nemo, corrupti mollitia reiciendis quisquam odit accusantium cupiditate sint incidunt, necessitatibus corporis perspiciatis veritatis sequi porro! Error nulla repellat molestias iure voluptates amet neque fugit inventore vero, numquam nesciunt officiis quam reiciendis voluptatem ex commodi voluptatum excepturi libero culpa tempore soluta expedita repellendus animi optio! Fugiat ipsum fugit itaque accusamus.
`.trim().split(' ');

const NUMBERS = []
for (let i = 0; i < 25; i++) NUMBERS.push(i);


/**
 * FUNCTIONS
 */
const $ = selector => document.querySelector(selector);
const $a = select => document.querySelectorAll(select);

const random = {
  randint(a, b) {
    if (b === undefined) {
      b = a;
      a = 0;
    }
    return Math.round(Math.random() * (b - a)) + a
  },
  choice(arr) {
    return arr[this.randint(arr.length - 1)]
  }
}

const spawnRandomElement = () => {
  spawnElement(random.choice(TYPES));
}

const spawnElement = type => {
  switch (type) {
    case PLUS:
      spawnPlus();
      break;
    case MINUS:
      spawnMinus();
      break;
    case WORD:
      spawnWord();
      break;
    case NUMBER:
      spawnNumber();
      break;
    default:
      break;
  }
}

const removeRandomElement = () => {
  const nonEmptyContainers = removeEls.filter(container => container.children.length);
  if (!nonEmptyContainers.length) return;
  const container = random.choice(nonEmptyContainers);
  const removedEl = random.choice(container.children);
  removedEl.remove();
}

const spawnPlus = (container=null) => {
  const btnEl = document.createElement('button');
  btnEl.innerText = '+';
  attachEvent(btnEl, spawnRandomElement);
  insertElement(btnEl, container);
}

const spawnMinus = (container=null) => {
  const btnEl = document.createElement('button');
  btnEl.innerText = '-';
  attachEvent(btnEl, removeRandomElement);
  insertElement(btnEl, container);
}

const spawnWord = (container=null) => {
  const spanEl = document.createElement('span');
  const text = random.choice(WORDS);
  spanEl.innerText = text;
  attachEvent(spanEl, setupPointsAdder(text.length));
  insertElement(spanEl, container);
}

const spawnNumber = (container=null) => {
  const spanEl = document.createElement('span');
  const num = random.choice(NUMBERS);
  spanEl.innerText = num;
  attachEvent(spanEl, setupPointsAdder(num));
  insertElement(spanEl, container);
}

const insertElement = (el, container=null) => {
  if (!container) insertRandomly(el);
  else container.appendChild(el);
}

const insertRandomly = el => {
  const container = random.choice(spawnEls);
  const idx = random.randint(container.children.length);

  // Append element
  if (idx === container.children.length) {
    container.appendChild(el);
  // Insert element before some existing child element
  } else {
    container.insertBefore(el, container[idx]);
  }
}

const setupPointsAdder = delta => {
  return () => {
    points += delta;
    updatePointsCounter();
  }
}

const updatePointsCounter = () => {
  counterEl.innerText = points;
}

const attachEvent = (el, handler) => {
  el.addEventListener('click', handler);
}

const setupElementsRemover = interval => {
  setInterval(removeRandomElement, interval);
}

const startGame = (...startEls) => {
  const start = () => {
    setupElementsRemover(2000);
    startEls.forEach(el => el.removeEventListener('click', start));
  }
  startEls.forEach(el => el.addEventListener('click', start));
}

/**
 * MAIN CODE
 */
let points = 0;
const spawnEls = [...$a('.spawn')];  // Containers where new elements will be spawned
const removeEls = [...$a('.remove')];  // Containers which children will be removed
const headingEls = [...$a('.heading')];
const menuEl = $('menu');
const counterEl = $('#counter');

headingEls.forEach(headingEl => attachEvent(headingEl, setupPointsAdder(-1)));
spawnPlus(menuEl);
spawnMinus(menuEl);

// Start element remover only if the player clicked on the menu button
startGame(...menuEl.children);
