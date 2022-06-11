const http = require('http');
const fs = require('fs');
const file = 'index.html';


const students = new Map();

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  switch (url.pathname) {
    case '/':
      fs.stat(file, (err, stats) => {
        if (!err) {
          fs.readFile(file, (err, data) => {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.write(data);
            res.end();
          });
        } else {
          res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.write(`The '${file}'file does not exist`);
          res.end();
        }
      });
      break;

    case '/submit':
      if (req.method === 'POST') {
        const chunks = [];
        req.on('data', chunk => chunks.push(chunk));
        req.on('end', () => {
          const body = chunks.join('');
          const data = JSON.parse(body);

          if (Object.keys(data).length === 1 && data.album !== undefined) {
            students.delete(data.album);
          } else {
            // Update the existing student
            if (students.has(data.album)) {
              const student = students.get(data.album);
              if (data.firstName) student.firstName = data.firstName;
              if (data.lastName) student.lastName = data.lastName;
              if (data.subject && data.grade) {
                const gradeObj = student.grades.find(val => val.subject === data.subject);
                if (gradeObj) gradeObj.grade = data.grade;
                else student.grades.push({
                  subject: data.subject,
                  grade: data.grade
                });
              }
              // Create the new student
            } else if (data.firstName && data.lastName) {
              students.set(data.album, {
                album: data.album,
                firstName: data.firstName,
                lastName: data.lastName,
                grades: []
              });
            }
          }

          res.end(createResponse());
        });
      }
      break;
  }
});

const createResponse = () => {
  const res = [];
  
  [...students.keys()].forEach(album => {
    const student = students.get(album);
    
    student.grades.forEach(gradeObj => {
      res.push({
        album,
        firstName: student.firstName,
        lastName: student.lastName,
        subject: gradeObj.subject,
        grade: gradeObj.grade
      });
    });
    
    if (!student.grades.length) {
      res.push({
        album,
        firstName: student.firstName,
        lastName: student.lastName,
        subject: '-',
        grade: '-'
      });
    }
  });

  return JSON.stringify(res);
};


server.listen(8080);


console.log('🚀 The server was started on port 8080');
console.log("To stop the server, press 'CTRL + C'");
