

var express = require('express');
var app 	= express();



app.use(express.static('./'));


var server = app.listen(3000, function (a, b) {
	var host = server.address().address;
	var port = server.address().port;

	console.log(' listening at http://%s:%s', host, port);
});

