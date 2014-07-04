(function (exports) {

    var device_model_simulation = {

        d: 0

    };

    function pad(num, size) {
        var s = num + "";
        while (s.length < size) s = "0" + s;
        return s;
    }




    exports.init = function (eventbus) {


        eventbus.emit("serial.simulation");
        eventbus.emit("serial.portopened");

        if (typeof String.prototype.startsWith != 'function') {
            String.prototype.startsWith = function (str) {
                return this.indexOf(str) == 0;
            };
        }

    };

})(typeof exports == 'undefined' ? this['simulator'] = {} : exports);