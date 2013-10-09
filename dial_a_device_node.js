(function(exports) {

var consolelogger, simulate, device, device_id, device_library, device_type, deviceconnection, ev, eventbus, heartbeat, http, ser_baud, ser_string, simulation, status, unique_id, url_string, util, webconnection;

// default parameters
ser_string = '/dev/ttyACM0';
ser_baud = 115200;
device_id = 0;
url_string = 'http://localhost:3000/websocket';
device_type = 'knf-sc920';
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


exports.run = function (eventbus) {

require ('coffee-script');

require('./app/assets/javascripts/dial_a_device_node/websocket_rails/websocket_rails.js.coffee');

require('./app/assets/javascripts/dial_a_device_node/websocket_rails/event.js.coffee');

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

eventbus.emit("device.announce.deviceid", [device_id]);

eventbus.emit("device.announce.devicetype", [device_type]);

device.init(eventbus);

consolelogger.init(eventbus);

deviceconnection.init(eventbus);

eventbus.emit("serial.set.baud", [ser_baud]);

eventbus.emit("serial.set.port", [ser_string]);

eventbus.emit("serial.connect");

eventbus.emit("webconnection.set.channelname", ['channel_dev_' + device_id]);

eventbus.emit("webconnection.set.url", [url_string]);

eventbus.emit("webconnection.set.deviceendpoint", [true]);

eventbus.emit("webconnection.connect");

if (simulate) {
	simulation.init(eventbus);
}

heartbeat = function() {
  return eventbus.emit("device.heartbeat");
};

 setInterval(heartbeat, 1000);

};

})(typeof exports == 'undefined'? this['dialadevicenode'] = {}: exports);