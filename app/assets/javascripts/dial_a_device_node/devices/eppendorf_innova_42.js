(function (exports) {

    var device_model = {

        temperature: 0,
        temperature_setpoint: 0,

        rotation: 0,
        rotation_setpoint: 0

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
	            "command": "get_setpoints"
	        });

            localeventbus.emit("device.command", {
                "command": "get_values"
            });


            eventbus.emit('ui.update', {
                    "component": "all",
                    "model": device_model
                });

            eventbus.emit('device.snapshot', device_model);

        });


        eventbus.on("device.command", function (data) {

            if (data.command == "get_setpoints") {

                eventbus.emit("serial.command", "RS");

            }

            if (data.command == "get_values") {

                eventbus.emit("serial.command", "RV");

            }

            
            if (data.command == "set_temperature_setpoint") {

                eventbus.emit("serial.immediatecommand", "CT "+data.value);

            }

            if (data.command == "set_rotation_setpoint") {

                eventbus.emit("serial.immediatecommand", "CS "+data.value);

            }  


        });


        eventbus.on("device.reply", function (lastmessage, data) {

            if (lastmessage.startsWith('RS')) {

                if (data.split(String.fromCharCode(13)).length > 1) {

                    device_model.rotation_setpoint = parseFloat(data.split(String.fromCharCode(13))[1].split(String.fromCharCode(9)[0]));
                    device_model.temperature_setpoint = parseFloat(data.split(String.fromCharCode(13))[1].split(String.fromCharCode(9)[1]));

                    eventbus.emit('device.assumeconnected');
                }

            }

            if (lastmessage.startsWith('RV')) {

                if (data.split(String.fromCharCode(13)).length > 1) {

                    device_model.rotation = parseFloat(data.split(String.fromCharCode(13))[1].split(String.fromCharCode(9)[0]));
                    device_model.temperature = parseFloat(data.split(String.fromCharCode(13))[1].split(String.fromCharCode(9)[1]));

                }

            }


        });


        eventbus.emit("device.initialized");

    };


})(typeof exports == 'undefined' ? this['device'] = {} : exports);