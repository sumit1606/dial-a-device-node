(function (exports) {

    var device_model_simulation = {

        amount: 400,
        time: 1000,
        timecounter: 0,
        amountcounter: 0,
        flowrate: 400.0,
        runmode: 0,
        runfunction: 0,
        cyclenumber: 1,
        actualcyclenumber: 1

    };

    exports.init = function (eventbus) {

        setInterval(function () {


            if (device_model_simulation.runfunction == 1) {

                device_model_simulation.timecounter = device_model_simulation.timecounter + 1000;

                
                if (device_model_simulation.runmode == 0) {


                    device_model_simulation.amountcounter = device_model_simulation.amountcounter + Math.round(device_model_simulation.flowrate / 60);

                    if (device_model_simulation.amountcounter >= device_model_simulation.amount) {

                        device_model_simulation.runfunction = 0;
                    }

                }

                if (device_model_simulation.runmode == 1) {


                    device_model_simulation.amountcounter = device_model_simulation.amountcounter + Math.round((device_model_simulation.amount / (device_model_simulation.time*1000)));

                    if (device_model_simulation.timecounter >= device_model_simulation.time) {

                        device_model_simulation.runfunction = 0;
                    }

                }

                if (device_model_simulation.runmode == 2) {


                    device_model_simulation.amountcounter = device_model_simulation.amountcounter + Math.round(device_model_simulation.flowrate / 60);

                    if (device_model_simulation.timecounter >= device_model_simulation.time) {

                        device_model_simulation.runfunction = 0;
                    }

                }

            }

            if (device_model_simulation.runfunction == 2) {

                device_model_simulation.timecounter = 2000;                
                device_model_simulation.runfunction = 0;
                device_model_simulation.amountcounter = 175;

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

                if (device_model_simulation.runfunction == 0 && data.value > 0) {

                    device_model.timecounter = 0;
                    device_model.amountcounter = 0;


                }

                device_model_simulation.runfunction = data.value;

            }

        });

    };

})(typeof exports == 'undefined' ? this['simulator'] = {} : exports);