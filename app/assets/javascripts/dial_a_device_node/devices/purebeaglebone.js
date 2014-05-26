(function(exports) {

    var device_model = {

        bbplatform: [],
        lastserialmessage: "",
        usrled0: '0',
        usrled1: '0',
        usrled2: '0',
        usrled3: '0'

    };

    exports.init = function (eventbus) {

        if (typeof String.prototype.startsWith != 'function') {
            String.prototype.startsWith = function (str){
                return this.indexOf(str) == 0;
            };
        }

        eventbus.on ("device.initialized", function () {

        });

        eventbus.on ("device.updatemodel", function (param) {

            device_model = param[0];

            eventbus.emit('ui.update', [{"component": "all", "model": device_model}]);
    
        });

        eventbus.on ("device.heartbeat", function () {

            var b = require('bonescript');

            // device_model.bbplatform = b.getPlatform();

            eventbus.emit('ui.update', [{"component": "bbplatform", "model": device_model}]);

            eventbus.emit('device.assumeconnected', []);


            b.pinMode("USR0", b.INPUT);

            b.digitalRead("USR0", function(x) {

                if (x.err == null) {
                    device_model.usrled0 = x.value;
                    eventbus.emit('ui.update', [{"component": "usrled0", "model": device_model}]);
 
                }
            });

            b.pinMode("USR1", b.INPUT);
            b.digitalRead("USR1", function(x) {
                if (x.err == null) {
                    device_model.usrled1 = x.value;
                    eventbus.emit('ui.update', [{"component": "usrled1", "model": device_model}]);

                }
            });

            b.pinMode("USR2", b.INPUT);
            b.digitalRead("USR2", function(x) {
                if (x.err == null) {
                    device_model.usrled2 = x.value;
                    eventbus.emit('ui.update', [{"component": "usrled2", "model": device_model}]);

                }
            });

            b.pinMode("USR3", b.INPUT);
            b.digitalRead("USR3", function(x) {
                if (x.err == null) {
                    device_model.usrled3 = x.value;
                    eventbus.emit('ui.update', [{"component": "usrled3", "model": device_model}]);

                }
            });
    
            eventbus.emit('ui.update', [{"component": "all", "model": device_model}]);       

        });

        eventbus.on ("device.command", function(data) {

            (typeof data.command == 'string'? data = data : data = data[0]);

            if (data.command == "setled") {

                var b = require('bonescript');

                b.pinMode(data.led, b.OUTPUT);
                b.digitalWrite(data.led, data.value);

                if (data.led == "USR0") { device_model.usrled0 = data.value }
                if (data.led == "USR1") { device_model.usrled1 = data.value }
                if (data.led == "USR2") { device_model.usrled2 = data.value }
                if (data.led == "USR3") { device_model.usrled3 = data.value }
            }

            if (data.command == "sendserial") {

                localeventbus.emit ("serial.send", data.value);
            }

        });

        eventbus.on ("serial.retrieve", function(data) {

            device_model.lastserialmessage = data;

            eventbus.emit('ui.update', [{"component": "all", "model": device_model}]);

            device_model.lastserialmessage = "";


        }); 

	   eventbus.emit ("device.initialized", []);

    };


})(typeof exports == 'undefined'? this['device'] = {}: exports);