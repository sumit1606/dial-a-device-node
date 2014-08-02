(function (exports) {

    var device_model_simulation = {

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

        setInterval(function () {


            if (device_model_simulation.heater_status == 1) {

                device_model_simulation.temperature = device_model_simulation.temperature_setpoint;

            } else {

                device_model_simulation.temperature = 21;

            }


            if (device_model_simulation.rotation_status == 1) {

                device_model_simulation.rotation = device_model_simulation.rotation_setpoint;

                time = time + 1;

            } else {

                device_model_simulation.rotation = 0;

                time = 0;

            }

            if (device_model_simulation.lift_status == 1) {

                if (device_model_simulation.lift < 10) {

                    device_model_simulation.lift = device_model_simulation.lift + 1;

                }

            } else if (device_model_simulation.lift_status == -1) {

                if (device_model_simulation.lift > 0) {

                    device_model_simulation.lift = device_model_simulation.lift - 1;

                }

            }


            eventbus.emit('ui.update', {
                    "component": "all",
                    "model": device_model_simulation
                });

            eventbus.emit('device.snapshot', device_model_simulation);


        }, 1000);

        eventbus.emit("serial.simulation");
        eventbus.emit("serial.portopened");


        eventbus.on("device.command", function (data) {

            if (data.command == "set_temperature_setpoint") {

                device_model_simulation.temperature_setpoint = data.value;

            }

            if (data.command == "set_rotation_setpoint") {

                device_model_simulation.rotation_setpoint = data.value;

            }  

            if (data.command == "set_lift_setpoint") {

                device_model_simulation.lift_setpoint = data.value;

            }  

            if (data.command == "set_shaking_time") {

                device_model_simulation.shaking_time = data.value;

            }


            if (data.command == "start_heater") {

                device_model_simulation.heater_status = 1;

            }

            if (data.command == "stop_heater") {

                device_model_simulation.heater_status = 0;

            }

            if (data.command == "start_rotation") {

                device_model_simulation.rotation_status = 1;

            }

            if (data.command == "stop_rotation") {

                device_model_simulation.rotation_status = 0;

            }

            if (data.command == "set_coolant_on") {

                device_model_simulation.coolant_valve = 1;

            }

            if (data.command == "set_coolant_off") {

                device_model_simulation.coolant_valve = 0;

            }

            if (data.command == "start_lift_up") {

                device_model_simulation.lift_status = 1;

            }

            if (data.command == "stop_lift_up") {

                device_model_simulation.lift_status = 0;

            }

            if (data.command == "start_lift_down") {

                device_model_simulation.lift_status = -1;

            }

            if (data.command == "stop_lift_down") {

                device_model_simulation.lift_status = 0;

            }

            if (data.command == "stop") {

                device_model_simulation.heater_status = 0;

                device_model_simulation.rotation_status = 0;

                device_model_simulation.lift_status = 0;

            }


        });

    };

})(typeof exports == 'undefined' ? this['simulator'] = {} : exports);