(function (exports) {

    var device_model_simulation = {

        weight: "  0.166 g ",
        power: 1

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


        eventbus.on("serial.immediatecommand", function (data) {

            if (data.startsWith('Sx1')) {

                device_model_simulation.weight = "  0.166 g ";

                if (device_model_simulation.power == 1) {

                    eventbus.emit("device.reply", "heartbeat", device_model_simulation.weight);

                }
                
            }

            if (data.startsWith('MT')) {

                device_model_simulation.weight = "  0.000 g ";

            }

            if (data.startsWith('SP')) {

                device_model_simulation.weight = "  0.555 g ";

            }

            if (data.startsWith('SS')) {

                if (device_model_simulation.power == 1) {

                    device_model_simulation.power = 0;
                } else {

                    device_model_simulation.power = 1;
                }

            }

        });


    };

})(typeof exports == 'undefined' ? this['simulator'] = {} : exports);