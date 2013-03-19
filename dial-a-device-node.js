
var util = require ('util');
var ser = require ('serialport');
var wsr = require ('./websocket_rails.js.coffee');


var serialport;
var websockets;

var localeventbus;

var lastmessage = new Array;
var currentmessage;
var waiting = false;

exports.websockets = websockets;

exports.init = function (eventbus) {
    localeventbus = eventbus;
    localeventbus.emit ("initialized");
	
	localeventbus.on ("serial_incoming", function (data) {

		localeventbus.emit ("serial_received", currentmessage, data);
		waiting = false;
	});

};
  
  
exports.openserialport = function (port, baud) {

  serialport = new ser.SerialPort (port, {
    baudrate: baud,
	parser: (ser.parsers.readline (String.fromCharCode(13)))
	});
	
  console.log ("serial port initialized: "+port +" "+baud);
  
  serialport.on ("open", function() {
    localeventbus.emit("serialport_opened");
	
	serialport.on ("data", function (data) {      
	  localeventbus.emit ("serial_incoming", data);	        
	});
  });
  
  return serialport;
	
};

exports.webconnect = function (url) {
    localeventbus.emit('connecting', url);	
    websockets = new WebSocketRails (url);
    localeventbus.emit('connected', url);
  };
  
  
exports.subscribe = function (channelname) {
    localeventbus.emit('subscribing', channelname);
    channel = websockets.subscribe (channelname);
	
	channel.bind ('client_connected', function (data) {
      console.log ('new client: ' + JSON.stringify (data));
	});
	
    localeventbus.emit('channelsubscription', channelname, channel);
  };
  
writenext = function () {  
  if (waiting) {
    localeventbus.emit ('writenext');
  } else if (lastmessage.length > 0) {
    // setTimeout (cancelcommand, 1000);
	waiting = true;	
	currentmessage = lastmessage.pop();
	serialport.write  (currentmessage.command+String.fromCharCode(13), function (err, results) {
	});
  }
};

exports.writenext = writenext;
 
exports.writedata = function (data) {
    lastmessage.push (data);
    writenext();
  };
