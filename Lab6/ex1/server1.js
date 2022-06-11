const http = require("http");
const fs = require("fs");
const file = 'form.html';

http.createServer(function (request, response) {
  console.log("--------------------------------------");
  console.log("The relative URL of the current request: " + request.url + "\n");
  let url = new URL(request.url, `http://${request.headers.host}`); // Create the URL object
  // Compare the relative URL
  switch (url.pathname) {
    // if relative URL is '/' then send, to a browser,
    // the contents of a file (an HTML document) - its name contains the 'file' variable
    case '/':
      fs.stat(file, function (err, stats) {
        if (err == null) { // If the file exists
          fs.readFile(file, function (err, data) { // Read it content
            response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
            response.write(data);   // Send the content to the web browser
            response.end();
          });
        }
        else { // If the file does not exists
          response.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
          response.write(`The '${file}'file does not exist`);
          response.end();
        } //else
      }); //fs.stat
      break;

    // Process the form content if relative URL is '/submit'
    case '/submit':
      switch (request.method) {
        case 'GET':
          const name = decodeURI(request.url).replace(/.*imie=/, '');
          // Only one of the three lines below can be uncommented
          let welcomeText = `Witaj ${name}`;                      // Plain text greeting
          // let welcomeXML = `<welcome>Witaj ${name}</welcome>`; // XML greeting
          // let welcomeJSON = `{"welcome": "Witaj ${name}"}`;     // JSON greeting

          // Send the plain text greeting
          if (welcomeText) {
            response.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
            response.write(welcomeText); // Data (response) that we want to send to the web browser
            response.end(); // Sending the response
            console.log("The server sent the '" + welcomeText + "' text to the browser");
          }
    
          // Send the XML greeting
          else if (welcomeXML) {
            response.writeHead(200, { "Content-Type": "application/xml" });
            response.write(welcomeXML); // Data (response) that we want to send to the web browser
            response.end(); // Sending the response
            console.log("The server sent the '" + welcomeXML + "' text to the browser");
          }
    
          // Send the JSON greeting
          else if (welcomeJSON) {
            response.writeHead(200, { "Content-Type": "application/json" });
            response.write(welcomeJSON); // Data (response) that we want to send to the web browser
            response.end(); // Sending the response
            console.log("The server sent the '" + welcomeJSON + "' text to the browser");
          }
          break;
        case 'POST':
          if (request.headers['content-type'] === 'application/x-www-form-urlencoded') {
            const chunks = [];
            request.on('data', chunk => chunks.push(chunk));
            request.on('end', () => {
              const body = chunks.join('');
              const name = decodeURI(body).replace(/.*imie=/, '');
              response.end(`Witaj ${name}`); // Sending the response
            });
          }
          break;
        default:
          break;
      }
  } //switch
}).listen(8080);

console.log("The server was started on port 8080");
console.log("To stop the server, press 'CTRL + C'");
