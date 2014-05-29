(function (exports) {

    var device_model_simulation = {

        temperature: '31.4',
        exttemperature: '25.3',
        rotation: '20',
        vacuum: '976'

    };

    exports.init = function (eventbus) {

        setInterval(function () {
            mystring = device_model_simulation.rotation + ";" + device_model_simulation.temperature + ";" + device_model_simulation.exttemperature + ";" + device_model_simulation.vacuum;
            eventbus.emit("device.reply", "heartbeat", mystring);
        }, 1000);

        eventbus.emit("serial.simulation");
        eventbus.emit("serial.portopened");

    };

})(typeof exports == 'undefined' ? this['simulator'] = {} : exports);