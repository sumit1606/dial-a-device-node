(function(exports) {

    var device_model = {

        bbplatform: [],
        userled0: '0',
        userled1: '0',
        userled2: '0',
        userled3: '0'

    };

    exports.init = function (eventbus) {

        if (typeof String.prototype.startsWith != 'function') {
            String.prototype.startsWith = function (str){
                return this.indexOf(str) == 0;
            };
        }

        setInterval (function() {

            // eventbus.emit ("device.requestheartbeat", []);

        }, 1000);


        eventbus.on ("device.initialized", function () {

        });

        eventbus.on ("device.updatemodel", function (param) {

            device_model = param[0];

            eventbus.emit('ui.update', [{"component": "all", "model": device_model}]);
    
        });

        eventbus.on ("device.heartbeat", function () {

            var b = require('bonescript');

            device_model.bbplatform = b.getPlatform();

            eventbus.emit('ui.update', [{"component": "bbplatform", "model": device_model}]);


            b.pinMode("USR0", b.INPUT);

            b.digitalRead("USR0", function(x) {

                if (x.err == null) {
                    device_model.userled0 = x.value;
                    eventbus.emit('ui.update', [{"component": "userled0", "model": device_model}]);
 
                }
            });

            b.pinMode("USR1", b.INPUT);
            b.digitalRead("USR1", function(x) {
                if (x.err == null) {
                    device_model.userled1 = x.value;
                    eventbus.emit('ui.update', [{"component": "userled1", "model": device_model}]);

                }
            });

            b.pinMode("USR2", b.INPUT);
            b.digitalRead("USR2", function(x) {
                if (x.err == null) {
                    device_model.userled2 = x.value;
                    eventbus.emit('ui.update', [{"component": "userled2", "model": device_model}]);

                }
            });

            b.pinMode("USR3", b.INPUT);
            b.digitalRead("USR3", function(x) {
                if (x.err == null) {
                    device_model.userled3 = x.value;
                    eventbus.emit('ui.update', [{"component": "userled3", "model": device_model}]);

                }
            });
           

        });

        eventbus.on ("device.command", function(data) {

            if (data[0].command == "setled") {

                var b = require('bonescript');

                b.pinMode(data[0].led, b.OUTPUT);
                b.digitalWrite(led, data[0].value);
            }
        }); 

	   eventbus.emit ("device.initialized", []);

    };


})(typeof exports == 'undefined'? this['device'] = {}: exports);