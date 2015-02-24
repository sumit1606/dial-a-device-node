(function (exports) {

    var device_model = {

        pump_engine: 0,
        in_line_valve: 0,
        coolant_valve: 0,
        venting_valve: 0,
        operation_mode: 1,

        current_pressure: 0.0,
        current_speed: "HI",
        process_runtime: "0:0",
        pressuresetpoint: 0,
        speedsetpoint: "HI",

        language: 1,
        pressureunit: 0,
        autostart: 0,
        acousticsignal: 0

    };

    exports.init = function (eventbus) {

        if (typeof String.prototype.startsWith != 'function') {
            String.prototype.startsWith = function (str) {
                return this.indexOf(str) == 0;
            };
        }


        eventbus.on("serial.portopened", function () {

            
            setTimeout(function () {

                eventbus.emit("serial.immediatecommand", "REMOTE 1");
                eventbus.emit("serial.immediatecommand", "CVC 3");
                eventbus.emit("serial.immediatecommand", "STORE");

                eventbus.emit("serial.command", "IN_VER");


            }, 500);

            

        });

        
        eventbus.on("device.heartbeat", function () {

        	localeventbus.emit("device.command", {
	            "command": "get_stat"
	        });

            localeventbus.emit("device.command", {
                "command": "get_pressure"
            });

            localeventbus.emit("device.command", {
                "command": "get_speed"
            });

            localeventbus.emit("device.command", {
                "command": "get_time"
            });

            localeventbus.emit("device.command", {
                "command": "get_pressuresetpoint"
            });

            localeventbus.emit("device.command", {
                "command": "get_speedsetpoint"
            });


            eventbus.emit('ui.update', {
                    "component": "all",
                    "model": device_model
                });

            eventbus.emit('device.snapshot', device_model);

        });


        eventbus.on("device.command", function (data) {

            if (data.command == "get_stat") {

                eventbus.emit("serial.command", "IN_STAT");

            }

            if (data.command == "get_pressure") {

                eventbus.emit("serial.command", "IN_PV_1");

            }

            if (data.command == "get_speed") {

                eventbus.emit("serial.command", "IN_PV_2");

            }

            if (data.command == "get_time") {

                eventbus.emit("serial.command", "IN_PV_3");

            }




            if (data.command == "get_pressuresetpoint") {

                eventbus.emit("serial.command", "IN_SP_1");

            }

            if (data.command == "get_speedsetpoint") {

                eventbus.emit("serial.command", "IN_SP_2");

            }




            if (data.command == "set_pressuresetpoint") {


                eventbus.emit("serial.immediatecommand", "OUT_SP_1 "+data.value.toString());

            }

            if (data.command == "set_speedsetpoint") {

                eventbus.emit("serial.immediatecommand", "OUT_SP_2 "+data.value.toString());

            }

            if (data.command == "set_pressureunit") {

                eventbus.emit("serial.immediatecommand", "OUT_CFG "+device_model.language.toString()+data.value.toString()+device_model.autostart.toString()+device_model.acousticsignal.toString());

            }


            if (data.command == "set_start") {

                eventbus.emit("serial.immediatecommand", "START");

            }

            if (data.command == "set_stop") {

                eventbus.emit("serial.immediatecommand", "STOP 0");

            }

            if (data.command == "toggle_ventvalve") {

                if (device_model.venting_valve == 0) {

                    eventbus.emit("serial.immediatecommand", "OUT_VENT 1");

                } else {

                    eventbus.emit("serial.immediatecommand", "OUT_VENT 0");

                }

            }

            if (data.command == "set_ventvalve") {

                eventbus.emit("serial.immediatecommand", "OUT_VENT "+data.value.toString());

            }

            if (data.command == "set_runmode") {

                eventbus.emit("serial.immediatecommand", "OUT_MODE "+data.value.toString());

            }
   

        });


        eventbus.on("device.reply", function (lastmessage, data) {


            if (lastmessage.startsWith('IN_STAT')) {

                device_model.pump_engine = parseInt(data[0]);

                device_model.in_line_valve = parseInt(data[1]);

                device_model.coolant_valve = parseInt(data[2]);

                device_model.venting_valve = parseInt(data[3]);

                device_model.operation_mode = parseInt(data[4]);

                eventbus.emit('device.assumeconnected');
            
            }

            if (lastmessage.startsWith('IN_PV_1')) {

                device_model.current_pressure = parseFloat(data);
            
            }

            if (lastmessage.startsWith('IN_PV_2')) {

                if (data == "HI") {

                    device_model.current_speed = 100;


                } else {

                    device_model.current_speed = parseInt(data);

                }
            
            }

            if (lastmessage.startsWith('IN_PV_3')) {

                device_model.process_runtime = data;
            
            }


            if (lastmessage.startsWith('IN_SP_1')) {

                device_model.pressuresetpoint = parseFloat(data);
            
            }
            
            if (lastmessage.startsWith('IN_SP_2')) {

                if (data == "HI") {

                    device_model.speedsetpoint = 100;                    

                } else {

                    device_model.speedsetpoint = parseInt(data);
                }
            
            }

        });


        eventbus.emit("device.initialized");


    };


})(typeof exports == 'undefined' ? this['device'] = {} : exports);