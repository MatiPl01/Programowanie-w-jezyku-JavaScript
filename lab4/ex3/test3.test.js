//Source:  https://codeforgeek.com/unit-testing-nodejs-application-using-mocha/
import supertest from 'supertest';

// This agent refers to PORT where program is runninng.
const server = supertest.agent("http://localhost:8080");

// UNIT test begin
const path1 = '../zad2/dir';
describe(`GET /submit?path=${path1}`, () => {
  it('should return a list of directory entities"', done => {
    server
      .get(`/submit?path=${path1}`)
      .expect('Content-Type', /text\/plain/)
      .expect(200, `Found 1 entities in directory:
file.txt`, done);
  });
});

const path2 = '../zad2/dir/file.txt';
describe(`GET /submit?path=${path2}`, () => {
  it('should return a content of the text file"', done => {
    server
      .get(`/submit?path=${path2}`)
      .expect('Content-Type', /text\/plain/)
      .expect(200, `File '../zad2/dir/file.txt' content:
Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis animi, hic ducimus excepturi similique veniam nostrum praesentium deleniti aliquid ad natus quo alias distinctio voluptas, pariatur, nam iure esse laboriosam sed deserunt doloremque culpa dolorem blanditiis eveniet! Optio impedit sapiente dicta unde velit incidunt quasi maxime, asperiores iste quisquam esse vel accusantium quae. Labore quaerat enim cum dolor eaque mollitia sit! Numquam tempore, impedit deserunt doloribus cupiditate officiis repellendus amet laboriosam eos atque quisquam est, necessitatibus, magnam quidem aliquid eaque explicabo dolor quibusdam. Asperiores animi ullam voluptatum. Quam exercitationem possimus sed laudantium reprehenderit totam, ipsum, ipsa, modi error consequuntur quaerat.`, done);
  });
});

const path3 = 'abcd';
describe(`GET /submit?path=${path3}`, () => {
  it('should return nothing for an entity that doesn\'t exist"', done => {
    server
      .get(`/submit?path=${path3}`)
      .expect('Content-Type', /text\/plain/)
      .expect(200, 'Error: Entity not found', done);
  });
});
