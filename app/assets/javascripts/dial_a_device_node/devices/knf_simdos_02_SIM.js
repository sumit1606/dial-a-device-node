(function (exports) {

    var device_model_simulation = {

        amount: 10,
        time: 0,
        timecounter: 0,
        amountcounter: 0,
        flowrate: 0.0,
        runmode: 0,
        runfunction: 0,
        cyclenumber: 1,
        actualcyclenumber: 1

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

        eventbus.on("device.immediatecommand", function (data) {

            if (data.command == "set_amount") {

                device_model_simulation.amount = data.value;

            }

            if (data.command == "set_flowrate") {

                device_model_simulation.flowrate = data.value;

            }

            if (data.command == "set_time") {

                device_model_simulation.time = data.value;

            }

            if (data.command == "set_runmode") {

                device_model_simulation.runmode = data.value;

            }

            if (data.command == "set_function") {

                device_model_simulation.runfunction = data.value;

            }

        }

    };

})(typeof exports == 'undefined' ? this['simulator'] = {} : exports);