(function (exports) {

    var device_model_simulation = {

    	temperature: 25.3,
        pressure: 1013.3,
        humidity: 50,
        lux: 200

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