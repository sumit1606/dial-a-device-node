(function (exports) {

    var device_model = {

        amount: 0.0,
        time: 0.0,
        timecounter: 0,
        amountcounter: 0.0,
        flowrate: 0.0,
        runmode: 0,
        runfunction: 0,
        cyclenumber: 1,
        actualcyclenumber: 1

    };

    exports.init = function (eventbus) {

        if (typeof String.prototype.startsWith != 'function') {
            String.prototype.startsWith = function (str) {
                return this.indexOf(str) == 0;
            };
        }


        function pad(n, width, z) {
          z = z || '0';
          n = n + '';
          return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
        }

        function toknftime(datetime) {

            var d = new Date(datetime);

            return pad(d.getHours(), 2) + pad(d.getMinutes(), 2) + pad(d.getSeconds(), 2) + "00";

        }

        function fromknftime(str) {

            var d = new Date(0, 0, 0, parseInt(str.substr(0, 2)), parseInt(str.substr(2, 2)), parseInt(str.substr(4, 2)), parseInt(str.substr(6, 2)));

            return Number(d);

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
                "command": "get_time"
            });

            localeventbus.emit("device.command", {
                "command": "get_runmode"
            });

            localeventbus.emit("device.command", {
                "command": "get_operationstatus"
            });

            localeventbus.emit("device.command", {
                "command": "get_runmodestatus"
            });

            localeventbus.emit("device.command", {
                "command": "get_dispensemodestatus"
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

            if (data.command == "set_amount") {

                eventbus.emit("serial.command", "DV"+pad(data.value, 8));

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

                eventbus.emit("serial.command", "RV"+pad(data.value, 8));

            }


            if (data.command == "get_time") {

                eventbus.emit("serial.command", "?DT");

            }

            if (data.command == "set_time") {

                eventbus.emit("serial.command", "DT"+toknftime(data.value));

            }

            if (data.command == "get_runmode") {

                eventbus.emit("serial.command", "?MS");

            }

            if (data.command == "get_operationstatus") {

                eventbus.emit("serial.command", "?SS1");

            }

            if (data.command == "get_runmodestatus") {

                eventbus.emit("serial.command", "?SS3");

            }

            if (data.command == "get_dispensemodestatus") {

                eventbus.emit("serial.command", "?SS4");

            }

            if (data.command == "set_runmode") {

                eventbus.emit("serial.immediatecommand", "MS"+data.value);

            }

            if (data.command == "set_function") {

                eventbus.emit("serial.immediatecommand", "KY"+data.value);

                device_model.runfunction = data.value;

            }

            

        });


        eventbus.on("device.reply", function (lastmessage, data) {

            eventbus.emit('device.assumeconnected');

            if (data.indexOf(String.fromCharCode(6)+String.fromCharCode(2)) > -1) {

                data = data.substring(data.indexOf(String.fromCharCode(6)+String.fromCharCode(2)));
                
            }


            if (lastmessage.startsWith('?DV')) {

                device_model.amount = parseFloat(data);

            
            }

            if (lastmessage.startsWith('?TT')) {

                device_model.timecounter = fromknftime(data.substring(1));

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

            if (lastmessage.startsWith('?SS1')) {

                if (parseInt(data) == 1) {

                    device_model.runfunction = 1; 

                } else {


                    device_model.runfunction = 0; 
                }

            }

            if (lastmessage.startsWith('?SS3')) {

                if (parseInt(data) == 1) {

                    device_model.runmode = 0;
                    device_model.runfunction = 1; 

                }

            }

            if (lastmessage.startsWith('?SS4')) {

                if (parseInt(data) == 1) {

                    
                    device_model.runfunction = 1; 

                }                

            }


        });


        eventbus.emit("device.initialized");

    };


})(typeof exports == 'undefined' ? this['device'] = {} : exports);