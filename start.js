var dialadevicenode = require ('./dial_a_device_node.js');

var b = require('bonescript'); 

b.readTextFile('/var/lib/cloud9/server.txt', function(x) {

	if ((x.data != null) && (x.data.length != 0)) { dialadevicenode.run_beaglebone(x.data); } else {

		dialadevicenode.run_beaglebone("localhost:5000");
	} 


});
