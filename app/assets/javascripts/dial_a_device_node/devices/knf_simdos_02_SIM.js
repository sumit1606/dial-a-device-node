(function (exports) {

    var device_model_simulation = {

        amount: 10.0

    };

    exports.init = function (eventbus) {

        eventbus.emit("serial.simulation");
        eventbus.emit("serial.portopened");

    };

})(typeof exports == 'undefined' ? this['simulator'] = {} : exports);