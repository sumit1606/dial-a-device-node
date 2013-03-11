
var util = require ('util');
var ser = require ('serialport');

function Master (eventbus) {

  var serialport;
  var websockets;
  
  var url = 'http://www.dial-a-device.com/websocket'; 
  
  
  this.url = url;
  
  this.serialport = serialport;
  this.websockets = websockets;
  
  this.options = {
	'device_type': 'knf_920'
  };
  
  
  
  return (this);
};

function init () {
    // eventbus.emit ("initialized");
  };
  
  function setserialport (serialport) {
    serialport = serialport;
    // eventbus.emit('init_serialport');
  };
  
  function defineserialport (port, baud) {

  serialport = new ser.SerialPort (port, {
    baudrate: baud,
	parser: (ser.parsers.readline (String.fromCharCode(13)))
	});
	
  console.log ("serial port initialized: "+port +" "+baud);

  serialport = serialport;
  
  serialport.on ("open", function() {
    console.log ("serial port opened");
    // eventbus.emit("portopened");
	});
	
  };

  function setwebsockets (websockets) {
    websockets = websockets;
    // eventbus.emit('init_websockets');
  };



