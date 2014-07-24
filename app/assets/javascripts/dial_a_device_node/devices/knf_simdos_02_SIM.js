(function (exports) {

    var device_model_simulation = {

        amount: 10.0,
        time: 0.0,
        timecounter: 0,
        amountcounter: 0.0,
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

    };

})(typeof exports == 'undefined' ? this['simulator'] = {} : exports);