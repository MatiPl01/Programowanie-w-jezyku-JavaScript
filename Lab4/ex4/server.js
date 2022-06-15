import fs from 'fs';
import http from 'http';
import Files from './modules/files.js';


const requestListener = (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  if (url.pathname === '/GET') {
    res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });

    if (req.method === 'GET') {
      const enteredPath = url.searchParams.get('path');
      Files.recursive(enteredPath);
    }
  } else {
    const html = fs.readFileSync('./index.html');
    res.write(html);
    res.end();
  }
}


const server = http.createServer(requestListener);
server.listen(8080);
console.log("🚀 The server was started on port 8080");
console.log("✋ To stop the server, press 'CTRL + C'");
