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

            eventbus.emit('ui.update.bbplatform', [device_model]);
            eventbus.emit('ui.update.usrled0', [device_model]);
            eventbus.emit('ui.update.usrled1', [device_model]);
            eventbus.emit('ui.update.usrled2', [device_model]);
            eventbus.emit('ui.update.usrled3', [device_model]);

    
        });

        eventbus.on ("device.heartbeat", function () {

            var b = require('bonescript');

            device_model.bbplatform = b.getPlatform();

            eventbus.emit('ui.update.bbplatform', [device_model]);
            eventbus.emit('device.snapshot', [device_model]);


            b.pinMode("USR0", b.INPUT);

            b.digitalRead("USR0", function(x) {

                if (x.err == null) {
                    device_model.userled0 = x.value;
                    eventbus.emit('ui.update.userled0', [device_model]);
                    eventbus.emit('device.snapshot', [device_model]);
                }
            });

            b.pinMode("USR1", b.INPUT);
            b.digitalRead("USR1", function(x) {
                if (x.err == null) {
                device_model.userled1 = x.value;
                eventbus.emit('ui.update.userled1', [device_model]);
                eventbus.emit('device.snapshot', [device_model]);
                }
            });

            b.pinMode("USR2", b.INPUT);
            b.digitalRead("USR2", function(x) {
                if (x.err == null) {
                device_model.userled2 = x.value;
                eventbus.emit('ui.update.userled2', [device_model]);
                eventbus.emit('device.snapshot', [device_model]);
                }
            });

            b.pinMode("USR3", b.INPUT);
            b.digitalRead("USR3", function(x) {
                if (x.err == null) {
                    device_model.userled3 = x.value;
                    eventbus.emit('ui.update.userled3', [device_model]);
                    eventbus.emit('device.snapshot', [device_model]);
                }
            });
           

        });

        eventbus.on ("device.immediatecommand", function(data) {

            var b = require('bonescript');

            b.pinMode(data[0].led, b.OUTPUT);
            b.digitalWrite(led, data[0].value);
        });

        eventbus.on ("device.set.usrled0", function(data) {
            eventbus.emit ("device.remotecommand", [{"command": "setled", "led": "USR0", "value": data}]);
        });

        eventbus.on ("device.set.usrled1", function(data) {
            eventbus.emit ("device.remotecommand", [{"command": "setled", "led": "USR1", "value": data}]);
        });

        eventbus.on ("device.set.usrled2", function(data) {
            eventbus.emit ("device.remotecommand", [{"command": "setled", "led": "USR2", "value": data}]);
        });

        eventbus.on ("device.set.usrled3", function(data) {
            eventbus.emit ("device.remotecommand", [{"command": "setled", "led": "USR3", "value": data}]);
        });
   

	   eventbus.emit ("device.initialized", []);

    };


})(typeof exports == 'undefined'? this['device'] = {}: exports);