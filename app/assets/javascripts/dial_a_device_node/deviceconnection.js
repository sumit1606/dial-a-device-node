var util = require ('util');
var ser = require ('serialport');

var serialport;

var localeventbus;

var lastmessage = new Array;
var currentmessage;
var waiting = false;

var port;
var baud;

exports.init = function (eventbus) {
    localeventbus = eventbus;
    localeventbus.emit ("serial.initialized");

    localeventbus.on ("serial.set.baud", function (data) {
    	baud = data[0];
    });

    localeventbus.on ("serial.set.port", function (data) {
    	port = data[0];
    });

    localeventbus.on ("serial.connect", function () {
    	serialport = new ser.SerialPort (port, {
			baudrate: baud,
			parser: (ser.parsers.readline (String.fromCharCode(13)))
		});

		serialport.on ("error", function (err) {
			localeventbus.emit ("serial.openfailed", err);
		});

		serialport.on ("close", function() {
			localeventbus.emit("serial.portclosed");

		});

  
		serialport.on ("open", function() {
			localeventbus.emit("serial.portopened");
	
			serialport.on ("data", function (data) {      
				localeventbus.emit ("serial.incoming", data);	        
			});

			localeventbus.on ("device.immediatecommand", function (msg) {
				waiting = false;	
				lastmessage = new Array;
				serialport.write  (msg.command+String.fromCharCode(13), function (err, results) {});
  			});

  			localeventbus.on ("serial.send", function (msg) {

				serialport.write  (msg+String.fromCharCode(13), function (err, results) {});
  			});

  			localeventbus.on ("serial.close", function (msg) {

				serialport.close();
  			});

			localeventbus.on ("serial.writenext", function () {
				setTimeout (function() {

  					if (waiting) {
						localeventbus.emit ('serial.writenext');
					} else if (lastmessage.length > 0) {

						waiting = true;	
						currentmessage = lastmessage.pop();
						serialport.write  (currentmessage+String.fromCharCode(13), function (err, results) {
						});
	
					}

				}, 100);

			});
		
		});
    });
	
	localeventbus.on ("serial.incoming", function (data) {

			if (data.substring(0,1) == "\n") {
				data = output.substring (1);
			}

		localeventbus.emit ("serial.retrieve", data);

		if (waiting) {

			localeventbus.emit ("device.reply", currentmessage, data);
			waiting = false;
		} else {

			if (data.substring(0,1) == "\n") {
				data = data.substring (1);
			}
			localeventbus.emit ("device.reply", "heartbeat", data);

		}
	});

	localeventbus.on ("device.command", function (msg) {
		localeventbus.emit ("serial.writemessage", msg);
  	});





	localeventbus.on ("serial.writemessage", function (data) {
		lastmessage.push (data);
    	localeventbus.emit("serial.writenext");
	});
	

};
  
