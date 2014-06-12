(function (exports) {

    var device_model = {

        amount: 0.0

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
	            "command": "get_amount"
	        });

        });


        eventbus.on("device.command", function (data) {

            if (data.command == "get_amount") {

                eventbus.emit("serial.command", "?DV");

            }

            

        });


        eventbus.on("device.reply", function (lastmessage, data) {

            eventbus.emit('device.assumeconnected');

            if (lastmessage.startsWith('?DV')) {

                device_model.amount = parseFloat(data) / 1000;

                eventbus.emit('ui.update', {
                    "component": "all",
                    "model": device_model
                });

            }


        });


        eventbus.emit("device.initialized");

    };


})(typeof exports == 'undefined' ? this['device'] = {} : exports);