(function (exports) {

    var device_model_simulation = {

        pump_engine: 0,
        in_line_valve: 0,
        coolant_valve: 0,
        venting_valve: 0,
        operation_mode: 1,

        current_pressure: 1013.0,
        current_speed: 0,
        process_runtime: "0:0",
        pressuresetpoint: 500,
        speedsetpoint: 100,

        language: 1,
        pressureunit: 0,
        autostart: 0,
        acousticsignal: 0,

        running: false


    };

    exports.init = function (eventbus) {

        setInterval(function () {

            eventbus.emit('ui.update', {
                    "component": "all",
                    "model": device_model_simulation
                });

            eventbus.emit('device.snapshot', device_model_simulation);


        }, 1000);

        eventbus.emit("serial.simulation");
        eventbus.emit("serial.portopened");

        setInterval(function () {

            // simulation tick

            if (device_model_simulation.venting_valve == 0) {

                if ((device_model_simulation.operation_mode == 1) && (device_model_simulation.running)) {
                    // Pump down
                    var oldpressure = parseInt(device_model_simulation.current_pressure);
                    var newpressure = oldpressure - 20;
                    if (newpressure <= 0) {
                        newpressure = 0;
                    }
                    device_model_simulation.current_pressure = newpressure.toString();
                }

                if ((device_model_simulation.operation_mode == 2) && (device_model_simulation.running)) {
                    // Vac control
                    var oldpressure = parseInt(device_model_simulation.current_pressure);

                    var newpressure = oldpressure;

                    if (oldpressure < device_model_simulation.pressuresetpoint) {
                        newpressure = oldpressure + 20;
                    }

                    if (oldpressure > device_model_simulation.pressuresetpoint) {
                        newpressure = oldpressure - 20;
                    }

                    if (Math.abs(oldpressure - newpressure) < 20) {
                        newpressure = device_model_simulation.pressuresetpoint;
                    }

                    device_model_simulation.current_pressure = newpressure.toString();
                }

            } else {
                // Increase pressure, because ventilation is open
                var oldpressure = parseInt(device_model_simulation.current_pressure);
                var newpressure = oldpressure + 300;
                if (newpressure > 1013) {
                    newpressure = 1013;
                }
                device_model_simulation.current_pressure = newpressure.toString();
            }

        }, 500);


        eventbus.on("device.command", function (data) {


            if (data.command == "set_pressuresetpoint") {


                device_model_simulation.pressuresetpoint = data.value;

            }

            if (data.command == "set_speedsetpoint") {

                device_model_simulation.speedsetpoint = data.value;

            }

            if (data.command == "set_pressureunit") {

                device_model_simulation.pressureunit = data.value;
            }


            if (data.command == "set_start") {

                device_model_simulation.running = true;

            }

            if (data.command == "set_stop") {

                device_model_simulation.running = false;

            }

            if (data.command == "toggle_ventvalve") {

                if (device_model_simulation.venting_valve == 0) {

                    device_model_simulation.venting_valve = 1;

                } else {

                    device_model_simulation.venting_valve = 0;

                }

            }

            if (data.command == "set_ventvalve") {

                device_model_simulation.venting_valve = data.value;

            }

            if (data.command == "set_runmode") {

                device_model_simulation.operation_mode = data.value;

            }

        });

    };

})(typeof exports == 'undefined' ? this['simulator'] = {} : exports);