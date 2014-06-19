(function (exports) {

    var device_model_simulation = {

        temperature: 21.0,
        temperature_setpoint: 100,
        heater_status: 0,
        rotation: 0,
        rotation_setpoint: 500,
        stirrer_status: 0

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

            if (device_model_simulation.heater_status == 1) {

                    var oldtemperature = device_model_simulation.temperature;

                    var newtemperature = oldtemperature;

                    if (oldtemperature < device_model_simulation.temperature_setpoint) {
                        newtemperature = newtemperature + 5;
                    }

                    if (oldtemperature > device_model_simulation.temperature_setpoint) {
                        newtemperature = newtemperature - 3;
                    }

                    if (Math.abs(oldtemperature - newtemperature) < 5) {
                        newtemperature = device_model_simulation.temperature_setpoint;
                    }

                    device_model_simulation.temperature = newtemperature;
                

            } else {
                
                var oldtemperature = device_model_simulation.temperature;
                var newtemperature = oldtemperature - 3;

                if (newtemperature < 22) {
                    newtemperature = 22;
                }
                device_model_simulation.temperature = newtemperature;
            }


            
            if (device_model_simulation.stirrer_status == 1) {

                    var oldrotation = device_model_simulation.rotation;

                    var newrotation = oldrotation;

                    if (oldrotation < device_model_simulation.rotation_setpoint) {
                        newrotation = newrotation + 50;
                    }

                    if (oldrotation > device_model_simulation.rotation_setpoint) {
                        newrotation = newrotation - 70;
                    }

                    if (Math.abs(oldrotation - newrotation) < 70) {
                        newrotation = device_model_simulation.rotation_setpoint;
                    }

                    device_model_simulation.rotation = newrotation;
                

            } else {
                
                var oldrotation = device_model_simulation.rotation;
                var newrotation = oldrotation - 50;

                if (newrotation < 0) {
                    newrotation = 0;
                }
                device_model_simulation.rotation = newrotation;
            }

        }, 500);

        eventbus.emit("serial.simulation");
        eventbus.emit("serial.portopened");


        if (typeof String.prototype.startsWith != 'function') {
            String.prototype.startsWith = function (str) {
                return this.indexOf(str) == 0;
            };
        }

        eventbus.on("serial.command", function (message) {

            var value = "OK";

            if (message.startsWith('START')) {

                dev = message.split("_")[1]

                switch (dev) {

                    case '1':
                        device_model_simulation.heater_status = 1;

                        break;
                    case '4':
                        device_model_simulation.stirrer_status = 1;
                        break;
                    
                }
                
            }

            if (message.startsWith('STOP')) {

                dev = message.split("_")[1]

                switch (dev) {

                    case '1':
                        device_model_simulation.heater_status = 2;

                        break;
                    case '4':
                        device_model_simulation.stirrer_status = 2;
                        break;
                    
                }
                
            }

            if (message.startsWith('STATUS')) {

                dev = message.split("_")[1]

                switch (dev) {

                    case '1':
                        value = device_model_simulation.heater_status;

                        break;
                    case '4':
                        value = device_model_simulation.stirrer_status;
                        break;
                    
                }
                
            }

            if (message.startsWith('IN_PV')) {

                dev = message.split(" ")[0].split("_")[2]

                switch (dev) {

                    case '1':
                        value = device_model_simulation.temperature;

                        break;
                    case '4':
                        value = device_model_simulation.rotation;
                        break;
                    
                }
                
            }

            if (message.startsWith('IN_SP')) {

                dev = message.split(" ")[0].split("_")[2]

                switch (dev) {

                    case '1':
                        value = device_model_simulation.temperature_setpoint;

                        break;
                    case '4':
                        value = device_model_simulation.rotation_setpoint;
                        break;
                    
                }
                
            }

            if (message.startsWith('OUT_SP')) {

                dev = message.split(" ")[0].split("_")[2]

                data = message.split(" ")[1]

                switch (dev) {

                    case '1':
                        device_model_simulation.temperature_setpoint = parseFloat(data);

                        break;
                    case '4':
                        device_model_simulation.rotation_setpoint = parseFloat(data);
                        break;
                    
                }
                
            }

            eventbus.emit("device.reply", message, value);

        });

    };

})(typeof exports == 'undefined' ? this['simulator'] = {} : exports);