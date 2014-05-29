(function (exports) {

    var device_model_simulation = {

        weight: "0.166[0]g",
        autoprint: "0",
        power: "1"

    };

    function pad(num, size) {
        var s = num + "";
        while (s.length < size) s = "0" + s;
        return s;
    }




    exports.init = function (eventbus) {

        setInterval(function () {

            if (device_model_simulation.power == "1") {

                if (device_model_simulation.autoprint == "1") {

                    eventbus.emit("device.reply", "heartbeat", device_model_simulation.weight);
                }

            }

        }, 3000);


        eventbus.emit("serial.simulation");
        eventbus.emit("serial.portopened");

        if (typeof String.prototype.startsWith != 'function') {
            String.prototype.startsWith = function (str) {
                return this.indexOf(str) == 0;
            };
        }


        eventbus.on("serial.command", function (data) {

            if (data.startsWith('D05')) {

                w = Math.floor((Math.random() * 100) + 1)

                // device_model_simulation.weight="0."+pad(w, 3)+"[0]g";

                device_model_simulation.weight = "0.166[0]g";

                eventbus.emit("device.reply", "heartbeat", device_model_simulation.weight);
            }

        });


        eventbus.on("serial.immediatecommand", function (data) {


            if (data.startsWith('T')) {

                device_model_simulation.weight = "0.000[0]g";

                eventbus.emit("device.reply", "heartbeat", device_model_simulation.weight);
            }

            if (data.startsWith('R')) {

                device_model_simulation.weight = "0.000[0]g";

                eventbus.emit("device.reply", "heartbeat", device_model_simulation.weight);
            }


            if (data.startsWith('C')) {

                device_model_simulation.weight = "0.000[0]g";

                eventbus.emit("device.reply", "heartbeat", device_model_simulation.weight);
            }

            if (data.startsWith('D06')) {

                if (device_model_simulation.power == "1") {

                    device_model_simulation.autoprint = "1";

                }
            }


            if (data.startsWith('D09')) {

                if (device_model_simulation.power == "1") {

                    device_model_simulation.autoprint = "0";
                }
            }

            if (data.startsWith('Q')) {
                if (device_model_simulation.power == "1") {
                    device_model_simulation.power = "0";
                }
                if (device_model_simulation.power == "0") {
                    device_model_simulation.power = "1";
                }
            }
        });


    };

})(typeof exports == 'undefined' ? this['simulator'] = {} : exports);