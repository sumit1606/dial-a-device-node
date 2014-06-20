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

            localeventbus.emit("device.command", {
                "command": "get_rotation"
            });

            localeventbus.emit("device.command", {
                "command": "get_temperature_setpoint"
            });

            localeventbus.emit("device.command", {
                "command": "get_rotation_setpoint"
            });

            localeventbus.emit("device.command", {
                "command": "get_heater_status"
            });

            localeventbus.emit("device.command", {
                "command": "get_stirrer_status"
            });

        });


        eventbus.on("device.command", function (data) {

            if (data.command == "get_temperature") {

                eventbus.emit("serial.command", "IN_PV_1");

            }

            if (data.command == "get_rotation") {

                eventbus.emit("serial.command", "IN_PV_4");

            }

            if (data.command == "get_temperature_setpoint") {

                eventbus.emit("serial.command", "IN_SP_1");

            }

            if (data.command == "get_rotation_setpoint") {

                eventbus.emit("serial.command", "IN_SP_4");

            }    

            if (data.command == "set_temperature_setpoint") {

                eventbus.emit("serial.immediatecommand", "OUT_SP_1 "+data.value);

            }

            if (data.command == "set_rotation_setpoint") {

                eventbus.emit("serial.immediatecommand", "OUT_SP_4 "+data.value);

            }  

            if (data.command == "get_heater_status") {

                eventbus.emit("serial.command", "STATUS_1");

            }

            if (data.command == "get_stirrer_status") {

                eventbus.emit("serial.command", "STATUS_4");

            }

            if (data.command == "start_heater") {

                eventbus.emit("serial.immediatecommand", "START_1");

            }

            if (data.command == "stop_heater") {

                eventbus.emit("serial.immediatecommand", "STOP_1");

            }

            if (data.command == "start_stirrer") {

                eventbus.emit("serial.immediatecommand", "START_4");

            }

            if (data.command == "stop_stirrer") {

                eventbus.emit("serial.immediatecommand", "STOP_4");

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

            if (lastmessage.startsWith('IN_PV_4')) {

                device_model.rotation = parseFloat(data.split(" ")[0]);

                eventbus.emit('ui.update', {
                    "component": "all",
                    "model": device_model
                });

            }

            if (lastmessage.startsWith('IN_SP_1')) {

                device_model.temperature_setpoint = parseFloat(data.split(" ")[0]);

                eventbus.emit('ui.update', {
                    "component": "all",
                    "model": device_model
                });

            }

            if (lastmessage.startsWith('IN_SP_4')) {

                device_model.rotation_setpoint = parseFloat(data.split(" ")[0]);

                eventbus.emit('ui.update', {
                    "component": "all",
                    "model": device_model
                });

            }

            if (lastmessage.startsWith('STATUS_1')) {

                device_model.heater_status = parseFloat(data.split(" ")[0][1]);

                eventbus.emit('ui.update', {
                    "component": "all",
                    "model": device_model
                });

            }

            if (lastmessage.startsWith('STATUS_4')) {

                device_model.stirrer_status = parseFloat(data.split(" ")[0][1]);

                eventbus.emit('ui.update', {
                    "component": "all",
                    "model": device_model
                });

            }


        });


        eventbus.emit("device.initialized");

    };


})(typeof exports == 'undefined' ? this['device'] = {} : exports);