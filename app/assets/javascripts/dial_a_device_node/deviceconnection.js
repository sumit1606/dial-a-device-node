var util = require('util');
var ser = require('serialport');

var serialport;

var localeventbus;

var lastmessage = new Array;
var currentmessage;
var waiting = false;

var port;
var baud;
var databit = 8;
var parity = "none";
var stopbit = 1;

var linebreak = hex2a('0D');
var suffix = hex2a('0D');
var prefix = "";

function hex2a(hexx) {
        var hex = hexx.toString();//force conversion
        var str = '';
        for (var i = 0; i < hex.length; i += 2)
            str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
        return str;
}

exports.init = function (eventbus) {
    localeventbus = eventbus;
    localeventbus.emit("serial.initialized");

    localeventbus.on("serial.set.baud", function (data) {
        baud = data;
    });

    localeventbus.on("serial.set.port", function (data) {
        port = data;
    });
    
    localeventbus.on("serial.set.linebreak", function (data) {
        linebreak = data;
    });
    
    localeventbus.on("serial.set.prefix", function (data) {
        prefix = data;
    });
    
    localeventbus.on("serial.set.suffix", function (data) {
        suffix = data;
    });
    
    localeventbus.on("serial.set.databit", function (data) {
        databit = data;
    });
    
    localeventbus.on("serial.set.parity", function (data) {
        parity = data;
    });
    
    localeventbus.on("serial.set.stopbit", function (data) {
        stopbit = data;
    });


    localeventbus.on("serial.connect", function () {
        
        if (linebreak == "") {
        serialport = new ser.SerialPort(port, {
            baudrate: baud,
            databit: databit,
            parity: parity,
            stopbit: stopbit,
            parser: (ser.parsers.raw)
        });
        } else {
            
            serialport = new ser.SerialPort(port, {
            baudrate: baud,
            databit: databit,
            parity: parity,
            stopbit: stopbit,
            parser: (ser.parsers.readline(hex2a(linebreak)))
            });
        }

        serialport.on("error", function (err) {
            localeventbus.emit("serial.openfailed", err);
        });

        serialport.on("close", function () {
            localeventbus.emit("serial.portclosed", port);

        });


        serialport.on("open", function () {
            localeventbus.emit("serial.portopened", port, baud);

            serialport.on("data", function (data) {
                localeventbus.emit("serial.incoming", data);
            });

            localeventbus.on("serial.immediatecommand", function (msg) {
                waiting = false;
                lastmessage = new Array;
                serialport.write(hex2a(prefix) + msg + hex2a(suffix), function (err, results) {});
            });
            
            localeventbus.on("serial.sendraw", function (msg) {
                
                waiting = false;
                lastmessage = new Array;
                serialport.write(hex2a(prefix) + hex2a(msg) + hex2a(suffix), function (err, results) {});
            });

            localeventbus.on("serial.command", function (data) {
                lastmessage.push(data);
                localeventbus.emit("serial.writenext");
            });


            localeventbus.on("serial.close", function (msg) {

                serialport.close();
            });

            localeventbus.on("serial.writenext", function () {
                setTimeout(function () {

                    if (waiting) {
                        localeventbus.emit('serial.writenext');
                    } else if (lastmessage.length > 0) {

                        waiting = true;
                        currentmessage = lastmessage.pop();
                        serialport.write(hex2a(prefix) + currentmessage + hex2a(suffix), function (err, results) {});

                    }

                }, 100);

            });

        });
    });


    localeventbus.on("serial.incoming", function (data) {
        
        if ((typeof data === "object")) {
            
            localeventbus.emit("serial.rawretrieve", data);
            
        } else {
            
            if (data.substring(0, 1) == "\n") {
                data = data.substring(1);
            }

            data = data.replace(/[^A-Za-z 0-9 \.,\?""!@#\$%\^&\*\(\)-_=\+;:<>\/\\\|\}\{\[\]`~]*/g, '');
            
            localeventbus.emit("serial.retrieve", data);
            
        }


        if (waiting) {

            localeventbus.emit("device.reply", currentmessage, data);
            waiting = false;
        } else {
            lastmessage = new Array;
            localeventbus.emit("device.reply", "heartbeat", data);
            
            
        }
    });


};