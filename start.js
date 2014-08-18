var dialadevicenode = require ('./dial_a_device_node.js');

var b = require('bonescript'); 

var host = "localhost:5000";

var verbose = false;


process.argv.forEach(function (val, index, array) {

	if (val.split("=").length > 1) {

		k = val.split("=")[0];
		v = val.split("=")[1];

		if (k == "host") {

			host = v;

		}
	}

	if (val == "verbose") {

		verbose = true;

	}

});

b.readTextFile('/var/lib/cloud9/server.txt', function(x) {

	if ((x.data != null) && (x.data.length != 0)) { dialadevicenode.run_beaglebone(x.data, verbose); } else {

		dialadevicenode.run_beaglebone(host, verbose);
	} 


});
