(function (exports) {

    var device_model = {

        time: 0,

        temperature: 0,
        temperature_setpoint: 0,
        heater_status: 0,

        coolant_valve: 0,

        rotation: 0,
        rotation_setpoint: 0,
        rotation_status: 0,

        lift: 0,
        lift_setpoint: 0,
        lift_status: 0

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
                "command": "get_params1"
            });

            localeventbus.emit("device.command", {
                "command": "get_params2"
            });

            localeventbus.emit("device.command", {
                "command": "get_params3"
            });

            eventbus.emit('ui.update', {
                    "component": "all",
                    "model": device_model
                });

            eventbus.emit('device.snapshot', device_model);

        });


        eventbus.on("device.command", function (data) {

            if (data.command == "get_params1") {

                eventbus.emit("serial.command", "pP");

            }

            if (data.command == "get_params2") {

                eventbus.emit("serial.command", "pC");

            }

            if (data.command == "get_params3") {

                eventbus.emit("serial.command", "pI");

            }

                

            if (data.command == "set_temperature_setpoint") {

                eventbus.emit("serial.immediatecommand", "cRt "+data.value);

            }

            if (data.command == "set_rotation_setpoint") {

                eventbus.emit("serial.immediatecommand", "cRr "+data.value);

            }  

            if (data.command == "set_lift_setpoint") {

                eventbus.emit("serial.immediatecommand", "cRq "+data.value);

            }  

            if (data.command == "set_shaking_time") {

                device_model.shaking_time = data.value;

                eventbus.emit("serial.immediatecommand", "cRe "+data.value);

            }


            if (data.command == "start_heater") {

                device_model.heater_status = 1;

                eventbus.emit("serial.immediatecommand", "dRh1");

            }

            if (data.command == "stop_heater") {

                device_model.heater_status = 0;

                eventbus.emit("serial.immediatecommand", "dRh2");

            }

            if (data.command == "start_rotation") {

                device_model.rotation_status = 1;

                eventbus.emit("serial.immediatecommand", "dR1");

            }

            if (data.command == "stop_rotation") {

                device_model.rotation_status = 0;

                eventbus.emit("serial.immediatecommand", "dR2");

            }

            if (data.command == "set_coolant_on") {

                device_model.coolant_valve = 1;

                eventbus.emit("serial.immediatecommand", "dW1");

            }

            if (data.command == "set_coolant_off") {

                device_model.coolant_valve = 0;

                eventbus.emit("serial.immediatecommand", "dW0");

            }

            if (data.command == "start_lift_up") {

                device_model.lift_status = 1;

                eventbus.emit("serial.immediatecommand", "dHu1");

            }

            if (data.command == "stop_lift_up") {

                device_model.lift_status = 0;

                eventbus.emit("serial.immediatecommand", "dHu0");

            }

            if (data.command == "start_lift_down") {

                device_model.lift_status = -1;

                eventbus.emit("serial.immediatecommand", "dHd1");

            }

            if (data.command == "stop_lift_down") {

                device_model.lift_status = 0;

                eventbus.emit("serial.immediatecommand", "dHd0");

            }

            if (data.command == "stop") {

                device_model.heater_status = 0;

                device_model.rotation_status = 0;

                device_model.lift_status = 0;

                eventbus.emit("serial.immediatecommand", "dE");

            }

        });


        eventbus.on("device.reply", function (lastmessage, data) {

            if (lastmessage.startsWith('pP')) {

                device_model.time = parseFloat(data.split(";")[0]);
                device_model.temperature = parseFloat(data.split(";")[1]);
                device_model.rotation = parseFloat(data.split(";")[2]);
                device_model.lift = parseFloat(data.split(";")[3]);

                eventbus.emit('device.assumeconnected');

            }

            if (lastmessage.startsWith('pC')) {

                device_model.temperature_setpoint = parseFloat(data.split(";")[0]);
                device_model.shaking_time = parseFloat(data.split(";")[1]);
                device_model.lift_setpoint = parseFloat(data.split(";")[2]);
                

            }

            if (lastmessage.startsWith('pI')) {
                

            }


        });


        eventbus.emit("device.initialized");

    };


})(typeof exports == 'undefined' ? this['device'] = {} : exports);