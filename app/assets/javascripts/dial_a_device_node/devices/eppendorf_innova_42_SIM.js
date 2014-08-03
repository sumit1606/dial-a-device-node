(function (exports) {

    var device_model_simulation = {

        temperature: 21.0,
        temperature_setpoint: 37,
        
        rotation: 0,
        rotation_setpoint: 500
        

    };

    exports.init = function (eventbus) {

        setInterval(function () {

            eventbus.emit('ui.update', {
                    "component": "all",
                    "model": device_model_simulation
                });

            eventbus.emit('device.snapshot', device_model_simulation);


        }, 1000);

        setInterval(function () {

            device_model_simulation.temperature = device_model_simulation.temperature_setpoint;
            device_model_simulation.rotation = device_model_simulation.rotation_setpoint;


        }, 500);

        eventbus.emit("serial.simulation");
        eventbus.emit("serial.portopened");


        if (typeof String.prototype.startsWith != 'function') {
            String.prototype.startsWith = function (str) {
                return this.indexOf(str) == 0;
            };
        }

        eventbus.on("device.command", function (data) {

            
            if (data.command == "set_temperature_setpoint") {

                device_model_simulation.temperature_setpoint = data.value;

            }

            if (data.command == "set_rotation_setpoint") {

                device_model_simulation.rotation_setpoint = data.value;

            }  


        });

    };

})(typeof exports == 'undefined' ? this['simulator'] = {} : exports);