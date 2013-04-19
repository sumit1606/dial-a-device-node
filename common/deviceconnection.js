
var util = require ('util');
var ser = require ('serialport');

var serialport;

var simulation = false;

var localeventbus;

var lastmessage = new Array;
var currentmessage;
var waiting = false;

exports.init = function (eventbus) {
    localeventbus = eventbus;
    localeventbus.emit ("initialized");
	
	localeventbus.on ("serial_incoming", function (data) {

		if (waiting) {

			localeventbus.emit ("serial_received", currentmessage, data);
			waiting = false;
		} else {
			localeventbus.emit ("serial_rawincoming", data);
		}
	});

};
  
  
exports.openserialport = function (port, baud) {


		simulation = false;

    serialport = new ser.SerialPort (port, {
      baudrate: baud,
	  parser: (ser.parsers.readline (String.fromCharCode(13)))
	  });
	
  console.log ("serial port initialized: "+port +" "+baud);
  
  serialport.on ("open", function() {
    localeventbus.emit("serialport_opened", []);
	
	serialport.on ("data", function (data) {      
	  localeventbus.emit ("serial_incoming", [data]);	        
	});
  });
  
  return serialport;
	
	
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
