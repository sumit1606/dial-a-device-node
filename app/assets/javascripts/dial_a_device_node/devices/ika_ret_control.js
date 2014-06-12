(function (exports) {

    var device_model = {

        temperature: 0,
        temperature_setpoint: 0,
        heater_status: 0,
        rotation: 0,
        rotation_setpoint: 0,
        stirrer_status: 0

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

        	localeventbus.emit("device.command", {
	            "command": "get_temperature"
	        });

        });


        eventbus.on("device.command", function (data) {

            if (data.command == "get_temperature") {

                eventbus.emit("serial.command", "IN_PV_1");

            }

            

        });


        eventbus.on("device.reply", function (lastmessage, data) {

            eventbus.emit('device.assumeconnected');

            if (lastmessage.startsWith('IN_PV_1')) {

                device_model.temperature = parseFloat(data.split(" ")[0]);

                eventbus.emit('ui.update', {
                    "component": "all",
                    "model": device_model
                });

            }


        });


        eventbus.emit("device.initialized");

    };


})(typeof exports == 'undefined' ? this['device'] = {} : exports);