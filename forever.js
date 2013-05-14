forever = require ('forever-monitor');

var child = new (forever.Monitor)('start.js', {
	silent: true,
	options: []
});

child.on('error', function () {
	console.log ('an error occured, restarting...');
});

child.start();
