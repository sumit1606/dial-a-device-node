(function(exports) {

var consolelogger, simulate, device, device_id, device_library, device_type, deviceconnection, ev, eventbus, heartbeat, http, ser_baud, ser_string, simulation, status, unique_id, url_string, util, webconnection;

var serialnumber, ipaddress, server;

var bbinfo;

var updateBB_loop = false;

var dialadevicenode;

var heartbeatinterval;

// default parameters
ser_string = '/dev/ttyUSB0';

ser_baud = 115200;
device_id = 0;

url_string = '192.168.7.1:3000/websocket';

device_type = 'purebeaglebone';
unique_id = '';
simulate = false;

exports.set_url_string = function (param) {
	url_string = param;
};

exports.set_device_type = function (param) {
	device_type = param;
};

exports.set_ser_string = function (param) {
	ser_string = param;
};

exports.set_simulate = function (param) {
	simulate = param;
};

exports.set_device_id = function (param) {
	device_id = param;
};

exports.set_unique_id = function (param) {
	unique_id = param;
};

exports.set_ser_baud = function (param) {
	ser_baud = param;
};


function getBBInfo(interval, action) {

	if (typeof interval === "undefined") {interval = 1000}

	if (typeof action === "undefined") {action = "start"}


	var intervalIDcheck = setInterval (function() {

		if (bbinfo && action != "heartbeat") {
			clearInterval(intervalIDcheck);

			bbinfo.ipaddress = ipaddress;

			if (bbinfo.id > 0) {

				if (action == "start") {

					run_dial_a_device();

				} else if (action == "heartbeat") {

					getBBInfo(10000, "heartbeat");

				}

			} else {

				console.log ("beaglebone not registered");

				if (typeof dialadevicenode === "undefined") { process.exit(1); } else { dialadevicenode.halt(); }
		
				
			}
		} else {

			var dialadeviceweb = require ('./dial-a-device-web.js');

			dialadeviceweb.getBBInfo(server, ipaddress, serialnumber, function (message) {
				
				console.log ("beaglebone registration response");
				console.log (message);

				bbinfo = message;

			}, function (message) {
				clearInterval(intervalIDcheck);
				console.log ("beaglebone registration failed ("+message+")");

				var exec = require ('child_process').exec;

				exec ('udhcpc -i eth0', function(error, stdout, stderr) {

					console.log ("resetting DHCP on eth0...");

					bbinfo = undefined;

					getBBInfo(8000, "start");

				});

				if (typeof dialadevicenode === "undefined") { process.exit(1); } else { dialadevicenode.halt(); }

				

			});


		}

	}, interval);

}


exports.run_beaglebone = function(host) {

	server = host;

	console.log ("connecting to "+host);

	var beaglebonechip = require ('./beaglebonechip.js');

	beaglebonechip.getSerialNumber(function(ser) {

		console.log ("serialnumber " +ser);

		serialnumber = ser;

		beaglebonechip.getIPAddress(function(ip) {

			ipaddress = ip;

			getBBInfo(2000, "start");

		});

	});


};

function run_dial_a_device() {

	if (!bbinfo.device) {

		console.log ("no device registered for this beaglebone");

		getBBInfo(5000);


	} else {

		getBBInfo(10000, "heartbeat");

		// successfully connected

		dialadevicenode = require ('./dial_a_device_node.js');

		dialadevicenode.set_ser_string (bbinfo.device.portname);

		dialadevicenode.set_ser_baud (parseInt(bbinfo.device.portbaud));

		dialadevicenode.set_device_id (bbinfo.device.id);

		dialadevicenode.set_url_string (server+'/websocket');

		dialadevicenode.set_device_type (bbinfo.devicetype.name);

		dialadevicenode.set_unique_id (serialnumber);

		dialadevicenode.set_simulate (false);

		dialadevicenode.run();

	}


};


exports.halt = function (eventbus) {

	webconnection.halt;

	clearInterval(heartbeatinterval);

	process.exit(1);

}

exports.run = function (eventbus) {

require ('coffee-script');

require('./app/assets/javascripts/dial_a_device_node/websocket_rails/websocket_rails.js.coffee');

require('./app/assets/javascripts/dial_a_device_node/websocket_rails/event.js.coffee');

require('./app/assets/javascripts/dial_a_device_node/websocket_rails/abstract_connection.js.coffee');

require('./app/assets/javascripts/dial_a_device_node/websocket_rails/http_connection.js.coffee');

require('./app/assets/javascripts/dial_a_device_node/websocket_rails/websocket_connection.js.coffee');

require('./app/assets/javascripts/dial_a_device_node/websocket_rails/channel.js.coffee');

util = require('util');

ev = require('events');

http = require('http');

device_library = './app/assets/javascripts/dial_a_device_node/devices/' + device_type + '.js';

device = require(device_library);

simulation = require('./app/assets/javascripts/dial_a_device_node/devices/'+ device_type +'_SIM.js');

deviceconnection = require('./app/assets/javascripts/dial_a_device_node/deviceconnection.js');

webconnection = require('./app/assets/javascripts/dial_a_device_node/webconnection.js');

consolelogger = require('./app/assets/javascripts/dial_a_device_node/consolelogger.js');

status = require('./app/assets/javascripts/dial_a_device_node/systemstatus.js');

eventbus = new ev.EventEmitter;

status.init(eventbus);

webconnection.init(eventbus, true);

webconnection.initsubscribe;

eventbus.emit("device.announce.deviceid", device_id);

eventbus.emit("device.announce.devicetype", device_type);

device.init(eventbus);

consolelogger.init(eventbus);

deviceconnection.init(eventbus);

eventbus.emit("serial.set.baud", ser_baud);

eventbus.emit("serial.set.port", ser_string);

if (ser_string == "serial") {

	eventbus.emit("serial.connect");

}

eventbus.emit("webconnection.set.channelname", 'channel_dev_' + device_id);

eventbus.emit("webconnection.set.url", url_string);

eventbus.emit("webconnection.set.deviceendpoint", true);

eventbus.emit("webconnection.connect");

if (simulate) {
	simulation.init(eventbus);
}

heartbeat = function() {
  return eventbus.emit("device.heartbeat");
};

heartbeatinterval = setInterval(heartbeat, 1000);

};

})(typeof exports == 'undefined'? this['dialadevicenode'] = {}: exports);