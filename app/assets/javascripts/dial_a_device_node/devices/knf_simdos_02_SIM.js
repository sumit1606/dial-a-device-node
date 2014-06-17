(function (exports) {

    var device_model_simulation = {

        amount: 10.0

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