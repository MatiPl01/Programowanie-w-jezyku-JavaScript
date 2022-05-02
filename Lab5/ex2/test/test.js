const supertest = require("supertest");
const chai = require('chai');
const { expect } = chai;
chai.use(require('chai-json'));

const server = supertest.agent("http://localhost:3000");
const { APP_NAME } = process.env;

// This will run the specific app and extract constant variables
const { x, y } = require(`../${APP_NAME}`); 
// Json file name where operations are stored
const JSON_FILE_NAME = 'operations';
const EXPECTED_RESULTS = [3, 10, 10, 5, 1];


const jsonObj = [
  {
    "op": "+",
    "x": 1,
    "y": 2
  },
  {
    "op": "-",
    "x": 15,
    "y": 5
  },
  {
    "op": "*",
    "x": 5,
    "y": 2
  },
  {
    "op": "/",
    "x": 10,
    "y": 2
  },
  {
    "op": "%",
    "x": 7,
    "y": 2
  }
]


describe('GET /', () => {
  it('should respond with html', done => {
    server
      .get('/')
      .expect('Content-Type', /html/)
      .expect(200)
      .end((err, res) => {
        expect(res.text).to.include(`${x} + ${y} = ${x + y}`)
        done();
      })
  });
});

describe(`GET /json/${JSON_FILE_NAME}`, () => {
  it('should respond with html', done => {
    server
      .get(`/json/${JSON_FILE_NAME}`)
      .expect('Content-Type', /html/)
      .expect(200)
      .end((err, res) => {
        EXPECTED_RESULTS.forEach(result => {
          expect(res.text).to.include(`<td>${result}</td>`);
        });
        done();
      })
  });
});

describe(`Test if a file is a json object containing the specified object`, () => {
  it('should be a JSON file with the specified JSON object', () => {
    expect(`./json/${JSON_FILE_NAME}.json`)
      .to.be.a.jsonFile()
      .and.to.be.a.jsonObj(jsonObj);
  });
});

describe(`Test if a file is a json object containing the specified properties`, () => {
  it('should be a JSON file with the specified properties', () => {
    expect(`./json/${JSON_FILE_NAME}.json`)
      .to.be.a.jsonFile()
      .and.contain.jsonWithProps({
        "op": "+",
        "x": 1,
        "y": 2
      })
      .and.contain.jsonWithProps({
        "op": "-",
        "x": 15,
        "y": 5
      })
      .and.contain.jsonWithProps({
        "op": "*",
        "x": 5,
        "y": 2
      })
      .and.contain.jsonWithProps({
        "op": "/",
        "x": 10,
        "y": 2
      })
      .and.contain.jsonWithProps({
        "op": "%",
        "x": 7,
        "y": 2
      });
  });
});
