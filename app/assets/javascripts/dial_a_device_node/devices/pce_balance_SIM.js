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

        setInterval(function () {
        
            eventbus.emit('ui.update', {
                    "component": "all",
                    "model": device_model_simulation
                });

            eventbus.emit('device.snapshot', device_model_simulation);


        }, 1000);


        eventbus.emit("serial.simulation");
        eventbus.emit("serial.portopened");

        if (typeof String.prototype.startsWith != 'function') {
            String.prototype.startsWith = function (str) {
                return this.indexOf(str) == 0;
            };
        }


        eventbus.on("device.command", function (data) {


            if (data.command == "power") {

            
                if (device_model_simulation.power == 1) {

                    device_model_simulation.power = 0;

                } else {

                    device_model_simulation.power = 1;

                }

            }

            if (data.command == "tare") {

                device_model_simulation.weight = " 0.000 g ";

            }


            if (data.command == "print") {

                device_model_simulation.weight = "  0.166 g ";

            }


        });


    };

})(typeof exports == 'undefined' ? this['simulator'] = {} : exports);