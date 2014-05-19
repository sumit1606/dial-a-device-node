(function(exports) {

    var b = require('bonescript');

    var device_model = {

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

            eventbus.emit ("device.heartbeat", []);

        }, 1000);


        eventbus.on ("device.initialized", function () {

        });

        eventbus.on ("device.requestheartbeat", function () {

        });

        eventbus.on ("device.heartbeat", function () {

            b.pinMode(led, 'in');

            b.digitalRead("USR0", function(x) {
                device_model.userled0 = x.value;
                eventbus.emit('ui.update.userled0', [device_model])
            });

            b.digitalRead("USR1", function(x) {
                device_model.userled1 = x.value;
                eventbus.emit('ui.update.userled1', [device_model])
            });

            b.digitalRead("USR2", function(x) {
                device_model.userled2 = x.value;
                eventbus.emit('ui.update.userled2', [device_model])
            });

            b.digitalRead("USR3", function(x) {
                device_model.userled3 = x.value;
                eventbus.emit('ui.update.userled3', [device_model])
            });
           

        });

        eventbus.on ("device.set.usrled0", function(data) {
            var led = "USR0";
            b.pinMode(led, 'out');
            b.digitalWrite(led, data);
        });

        eventbus.on ("device.set.usrled1", function(data) {
            var led = "USR1";
            b.pinMode(led, 'out');
            b.digitalWrite(led, data);
        });

        eventbus.on ("device.set.usrled2", function(data) {
            var led = "USR2";
            b.pinMode(led, 'out');
            b.digitalWrite(led, data);
        });

        eventbus.on ("device.set.usrled3", function(data) {
            var led = "USR3";
            b.pinMode(led, 'out');
            b.digitalWrite(led, data);
        });
   

	   eventbus.emit ("device.initialized", []);

    };


})(typeof exports == 'undefined'? this['device'] = {}: exports);