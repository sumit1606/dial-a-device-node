(function (exports) {

    var device_model = {

        amount: 0.0,
        timecounter: 0,
        amountcounter: 0.0,
        flowrate: 0.0,
        runmode: 0

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

            localeventbus.emit("device.command", {
                "command": "get_timecounter"
            });

            localeventbus.emit("device.command", {
                "command": "get_amountcounter"
            });

            localeventbus.emit("device.command", {
                "command": "get_flowrate"
            });

            localeventbus.emit("device.command", {
                "command": "get_runmode"
            });

            eventbus.emit('ui.update', {
                    "component": "all",
                    "model": device_model
                });

        });


        eventbus.on("device.command", function (data) {

            if (data.command == "get_amount") {

                eventbus.emit("serial.command", "?DV");

            }

            if (data.command == "get_timecounter") {

                eventbus.emit("serial.command", "?TT");

            }

            if (data.command == "get_amountcounter") {

                eventbus.emit("serial.command", "?TV");

            }

            if (data.command == "get_flowrate") {

                eventbus.emit("serial.command", "?RV");

            }

            if (data.command == "set_flowrate") {

                eventbus.emit("serial.command", "RV"+data.value);

            }

            if (data.command == "get_runmode") {

                eventbus.emit("serial.command", "?MS");

            }

            if (data.command == "set_function") {

                eventbus.emit("serial.command", "KY"+data.value);

            }

            

        });


        eventbus.on("device.reply", function (lastmessage, data) {

            eventbus.emit('device.assumeconnected');

            if (data.indexOf(String.fromCharCode(6)+String.fromCharCode(2)) > -1) {

                data = data.substring(data.indexOf(String.fromCharCode(6)+String.fromCharCode(2))+1);
                
            }


            if (lastmessage.startsWith('?DV')) {

                device_model.amount = parseFloat(data) / 1000;

            
            }

            if (lastmessage.startsWith('?TT')) {

                device_model.timecounter = parseFloat(data);

            }

            if (lastmessage.startsWith('?TV')) {

                device_model.amountcounter = parseFloat(data);

            }

            if (lastmessage.startsWith('?RV')) {

                device_model.flowrate = parseFloat(data);

            }

            if (lastmessage.startsWith('?MS')) {

                device_model.runmode = parseInt(data);

            }


        });


        eventbus.emit("device.initialized");

    };


})(typeof exports == 'undefined' ? this['device'] = {} : exports);