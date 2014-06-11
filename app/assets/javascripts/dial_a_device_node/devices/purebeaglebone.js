(function (exports) {
    
    function hex2a(hexx) {
        var hex = hexx.toString();//force conversion
        var str = '';
        for (var i = 0; i < hex.length; i += 2)
            str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
        return str;
    }

    var device_model = {

        customui: "",
        bbplatform: [],
        lastserialmessage: "",
        usrled0: '0',
        usrled1: '0',
        usrled2: '0',
        usrled3: '0',
        serialstatus: false,
        serialport: "",
        serialbaud: "",
        serialdatabit: 8,
        serialparity: "none",
        serialstopbit: 1,
        seriallinebreak: hex2a('0D'),
        serialsuffix: hex2a('0D'),
        serialprefix: ""

    };

    exports.init = function (eventbus) {

        if (typeof String.prototype.startsWith != 'function') {
            String.prototype.startsWith = function (str) {
                return this.indexOf(str) == 0;
            };
        }

        eventbus.on("device.initialized", function () {

        });


        eventbus.on("device.heartbeat", function () {

            var b = require('bonescript');

            // device_model.bbplatform = b.getPlatform();

            eventbus.emit('ui.update', {
                "component": "bbplatform",
                "model": device_model
            });

            eventbus.emit('device.assumeconnected');


        });

        eventbus.on("device.command", function (data) {

            if (data.command == "retrievecustomui") {

                var b = require('bonescript');

                b.readTextFile('/var/lib/cloud9/customui.txt', function(x) {

                    if ((x.data != null) && (x.data.length != 0)) {

                        device_model.customui = x.data;

                        eventbus.emit('ui.update', {
                            "component": "bbplatform",
                            "model": device_model
                        });

                        device_model.customui = "";

                    }

                });

            }

            if (data.command == "setled") {

                var b = require('bonescript');

                b.pinMode(data.led, b.OUTPUT);
                b.digitalWrite(data.led, data.value);

                if (data.led == "USR0") {
                    device_model.usrled0 = data.value
                }
                if (data.led == "USR1") {
                    device_model.usrled1 = data.value
                }
                if (data.led == "USR2") {
                    device_model.usrled2 = data.value
                }
                if (data.led == "USR3") {
                    device_model.usrled3 = data.value
                }
            }

            if (data.command == "sendserial") {

                localeventbus.emit("serial.immediatecommand", data.value);
            }
            
            if (data.command == "sendraw") {

                localeventbus.emit("serial.sendraw", data.value);
            }

            if (data.command == "serialsetport") {

                localeventbus.emit("serial.set.port", data.value);

                device_model.serialport = data.value;

                eventbus.emit('ui.update', {
                "component": "all",
                "model": device_model
            });

            }
            
            if (data.command == "serialsetdatabit") {

                localeventbus.emit("serial.set.databit", data.value);

                device_model.serialdatabit = data.value;

                eventbus.emit('ui.update', {
                    "component": "all",
                    "model": device_model
                });

            }
            
            if (data.command == "serialsetparity") {

                localeventbus.emit("serial.set.parity", data.value);

                device_model.serialparity = data.value;

                eventbus.emit('ui.update', {
                    "component": "all",
                    "model": device_model
                });

            }
            
            if (data.command == "serialsetstopbit") {

                localeventbus.emit("serial.set.stopbit", data.value);

                device_model.serialstopbit = data.value;

                eventbus.emit('ui.update', {
                    "component": "all",
                    "model": device_model
                });

            }

            if (data.command == "serialsetbaud") {

                localeventbus.emit("serial.set.baud", parseInt(data.value));

                device_model.serialbaud = data.value;

                eventbus.emit('ui.update', {
                "component": "all",
                "model": device_model
            });
            }
            
            if (data.command == "serialsetlinebreak") {

                localeventbus.emit("serial.set.linebreak", data.value);

                device_model.seriallinebreak = data.value;

                eventbus.emit('ui.update', {
                "component": "all",
                "model": device_model
            });
            }
            
            if (data.command == "serialsetprefix") {

                localeventbus.emit("serial.set.prefix", data.value);

                device_model.serialprefix = data.value;

                eventbus.emit('ui.update', {
                "component": "all",
                "model": device_model
            });
            }
            
            if (data.command == "serialsetsuffix") {

                localeventbus.emit("serial.set.suffix", data.value);

                device_model.serialsuffix = data.value;

                eventbus.emit('ui.update', {
                "component": "all",
                "model": device_model
            });
            }

            if (data.command == "serialopen") {

                localeventbus.emit("serial.connect", data.value);

                eventbus.emit('ui.update', {
                "component": "all",
                "model": device_model
            });
            }

            if (data.command == "serialclose") {

                localeventbus.emit("serial.close", data.value);

                eventbus.emit('ui.update', {
                "component": "all",
                "model": device_model
            });
            }

        });

        eventbus.on("serial.portopened", function(port, baud) {

            device_model.serialstatus = true;
            device_model.serialport = port;
            device_model.serialbaud = baud;

        });

        eventbus.on("serial.portclosed", function(port) {

            device_model.serialstatus = false;

        });

        eventbus.on("serial.retrieve", function (data) {

            device_model.lastserialmessage = data;

            eventbus.emit('ui.update', {
                "component": "all",
                "model": device_model
            });

            device_model.lastserialmessage = "";


        });
        
        eventbus.on("serial.rawretrieve", function (data) {

            device_model.lastserialmessage = data;

            eventbus.emit('ui.update', {
                "component": "all",
                "model": device_model
            });

            device_model.lastserialmessage = "";


        });

        eventbus.emit("device.initialized");

    };


})(typeof exports == 'undefined' ? this['device'] = {} : exports);