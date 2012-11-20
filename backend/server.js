//var sys = require('sys');
var http = require('http');
var port = 8080;
http.createServer(function (req, res) {
	//sys.puts("I got kicked");
  res.writeHeader(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
}).listen(port);
//console.log('Server running on port ' + port);
