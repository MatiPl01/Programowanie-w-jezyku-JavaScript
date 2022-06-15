import { checkEntityType, readFile } from './module.js';
import http from 'http';
import fs from 'fs';
/**
	 * Handles incoming requests.
	 *
	 * @param {IncomingMessage} request - Input stream — contains data received from the browser, e.g. encoded contents of HTML form fields.
	 * @param {ServerResponse} response - Output stream — put in it data that you want to send back to the browser.
	 * The answer sent by this stream must consist of two parts: the header and the body.
	 * <ul>
	 *  <li>The header contains, among others, information about the type (MIME) of data contained in the body.
	 *  <li>The body contains the correct data, e.g. a form definition.
	 * </ul>
	*/
function requestListener(request, response) {
	console.log("--------------------------------------");
	console.log("The relative URL of the current request: " + request.url + "\n");
	var url = new URL(request.url, `http://${request.headers.host}`); // Create the URL object
	if (url.pathname === '/submit') { // Processing the form content, if the relative URL is '/submit'
		/* ************************************************** */
		console.log("Creating a response header");
		// Creating an answer header — we inform the browser that the body of the answer will be plain text
		response.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
		/* ************************************************** */
		console.log("Creating a response body");

		if (request.method === 'GET') {
			const path = url.searchParams.get('path');

			checkEntityType(path, type => {
				switch (type) {
					case 'directory':
						fs.readdir(path, (err, entities) => {
							if (err) console.error(`Unable to read the contents of a directory located at '${path}'`);
							else {
								response.write(`Found ${entities.length} entities in directory:\n${entities.join('\n')}`);
								console.log("Sending the response");
								response.end(); 
							}
						});
						break;
				
					case 'file':
						readFile(path, (err, content) => {
							content = content.trim();
							if (err) console.error(`Unable to read a file '${path}'`);
							else {
								response.write(`File '${path}' content:\n${content}`);
								console.log("Sending the response");
								response.end(); 
							}
						})					
						break;

					case 'other':
						response.write('Not supported entity type');
						response.end();
						break;

					default:
						response.write('Error: Entity not found');
						response.end();
				}
			});
		}
	}
	else { // Generating the form
		/* ************************************************** */
		console.log("Creating a response header")
		// Creating a response header — we inform the browser that the body of the response will be HTML text
		response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
		/* ************************************************** */
		console.log("Creating a response body");
		// and now we put an HTML form in the body of the answer
		response.write(`<form method="GET" action="/submit">
	    					<label for="path">Enter entity path</label>
	    					<input name="path">
	    					<br>
	    					<input type="submit">
	    					<input type="reset">
	    				</form>`);
		/* ************************************************** */
		console.log("Sending the response");
		response.end();  // The end of the response — send it to the browser
	}
}

/* ************************************************** */
/* Main block
/* ************************************************** */
var server = http.createServer(requestListener); // The 'requestListener' function is defined above
server.listen(8080);
console.log("The server was started on port 8080");
console.log("To stop the server, press 'CTRL + C'");

// ../zad2/dir					- directory
// ../zad2/dir/file.txt - file
// somethingwrong				- doesn't exist
