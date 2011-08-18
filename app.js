var http = require('http');
var sys = require('sys');
var url = require('url');

http.createServer(function(request, response) {
	//TODO:very awful implementation. Maybe there is a better way to 
	//transfer the request.
	var h = url.parse('http://' + request.headers['host']);
	var options = {
		host: h['hostname'],
		port: h['port'],
		path: request.url,
		method: request.method,
		headers: request.headers
	};
	var proxy = http.request(options, function(proxy_response) {
		proxy_response.addListener('data', function(chunk) {
			response.write(chunk, 'binary');
		});

		proxy_response.addListener('end', function(){
			response.end();
		});
		response.writeHead(proxy_response.statusCode, proxy_response.headers);
	});
	request.addListener('data', function(chunk){
		proxy.write(chunk, 'binary');
	});

	request.addListener('end', function(){
		proxy.end();
	});
}).listen(8080);
console.log('Server running at port 8080');
