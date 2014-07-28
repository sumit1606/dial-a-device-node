(function (exports) {

    var device_model = {

        weight: '  0.0000 g ',
        power: 0

    };

    exports.init = function (eventbus) {

        if (typeof String.prototype.startsWith != 'function') {
            String.prototype.startsWith = function (str) {
                return this.indexOf(str) == 0;
            };
        }

        eventbus.on("device.initialized", function () {

        });


        eventbus.on("device.heartbeat", function () {

            localeventbus.emit("device.command", {
                "command": "get_weight"
            });
            

            eventbus.emit('ui.update', {
                    "component": "all",
                    "model": device_model
                });

            eventbus.emit('device.snapshot', device_model);

        });


        eventbus.on("device.command", function (data) {

            if (data.command == "get_weight") {

                eventbus.emit("serial.immediatecommand", "Sx1");

            }

            if (data.command == "power") {

                eventbus.emit("serial.immediatecommand", "SS");

                if (device_model.power == 1) {

                    device_model.power = 0;

                }

            }

            if (data.command == "tare") {

                eventbus.emit("serial.immediatecommand", "ST");

            }


            if (data.command == "print") {

                eventbus.emit("serial.immediacommand", "SP");

            }


        });


        eventbus.on("device.reply", function (lastmessage, data) {

            eventbus.emit('device.assumeconnected');

            if (lastmessage.startsWith('heartbeat')) {

                if (data == "MT") {

                } else if (data == "MS") {

                } else if (data == "MZ") {

                } else {

                    device_model.weight = data;

                    device_model.power = 1;

                }
                

                eventbus.emit('ui.update', {
                    "component": "all",
                    "model": device_model
                });

                eventbus.emit('device.snapshot', device_model);
            }


        });

    };

})(typeof exports == 'undefined' ? this['device'] = {} : exports);