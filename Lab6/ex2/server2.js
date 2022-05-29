const fs = require('fs');

function onRequest_8080(request, response) {
  response.writeHead(200, {'Content-Type': 'text/html'});
  fs.readFile('form.html', 'utf-8', (err, data) => {
    if (err) throw err;
    response.end(data);
  });
}

function onRequest_8081(request, response) {
  response.writeHead(200, { 
    'Content-Type': 'text/html',
    'Access-Control-Allow-Origin': 'http://localhost:8080'
  });

  const date = new Date();

  response.end(`
    <div>
      <span id='date'>${date.toLocaleDateString()}</span>
      <span id='time'>${date.toLocaleTimeString()}</span>
    </div>
  `)
}

/* ************************************************** */
/* Main block
/* ************************************************** */
var http = require('http');

http.createServer(onRequest_8080).listen(8080);
http.createServer(onRequest_8081).listen(8081);
console.log("The server was started on port 8080 and 8081");
console.log("To stop the server, press 'CTRL + C'");
