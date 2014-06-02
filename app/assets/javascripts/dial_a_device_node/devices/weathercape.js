(function (exports) {

    var device_model = {

        temperature: 0,
        pressure: 0,
        humidity: 0,
        lux: 0

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

            eventbus.emit('device.assumeconnected');

            var pressureInput = '/sys/bus/i2c/devices/1-0077/pressure0_input';
            var humidityInput = '/sys/bus/i2c/devices/1-0040/humidity1_input';
            var temperatureInput0= '/sys/bus/i2c/devices/1-0077/temp0_input';
            var luxInput= '/sys/bus/i2c/devices/1-0039/lux1_input';
            var temperatureInput1= '/sys/bus/i2c/devices/1-0040/temp1_input';

            function printPressure(x) {
                device_model.pressure = x.data/100;

                b.readTextFile(humidityInput, printHumidity);
            }

            function printHumidity(x){
                device_model.humidity = x.data/1000;
                b.readTextFile(temperatureInput0, printTemperature);
            }

            function printTemperature(x){
                device_model.temperature = x.data/10;
                b.readTextFile(luxInput, printLux);
            }

            function printLux(x){
                device_model.lux = x.data;

                eventbus.emit('ui.update', {
                    "component": "all",
                    "model": device_model
                });

               eventbus.emit('device.snapshot', device_model);

            }

            b.readTextFile(pressureInput, printPressure);

        });


        eventbus.emit("device.initialized");

    };


})(typeof exports == 'undefined' ? this['device'] = {} : exports);