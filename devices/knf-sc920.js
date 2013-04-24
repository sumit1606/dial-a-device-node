
(function(exports) {

    var device_model = {

        runmode: 'n',
        pressure: '0',
        setpoint: '0',
        power: '0',
        ventilation: '0',
        coolant: '0',
        runtime: '0',
        pressureunit: '0'

    };

    exports.init = function (eventbus) {

        if (typeof String.prototype.startsWith != 'function') {
            String.prototype.startsWith = function (str){
                return this.indexOf(str) == 0;
            };
        }

        eventbus.on ("device.initialized", function () {

        });

        eventbus.on ("device.heartbeat", function () {

            eventbus.emit ("device.command", [{"command": "pP"}]);
            eventbus.emit ("device.command", [{"command": "gM"}]);
            eventbus.emit ("device.command", [{"command": "gUp"}]);
            eventbus.emit ("device.command", [{"command": "gV"}]);
            eventbus.emit ("device.command", [{"command": "gW"}]);
            
        });

        eventbus.on ("device.reply", function(params, data) {


            if (typeof params.command == 'string') {
                lastmessage = params;
            }
            else {
                lastmessage = params[0];
                data = params[1];
            }


            if (lastmessage.command.startsWith ('pP')) {

                var re = data.split(';');

                device_model.runtime = re[0].trim();
                device_model.pressure = re[1].trim();
                device_model.setpoint = re[2].trim();
                device_model.power = re[3].trim();

                eventbus.emit('ui.update.runtime', [device_model]);
                eventbus.emit('ui.update.pressure', [device_model]);
                eventbus.emit('ui.update.setpoint', [device_model]);
                eventbus.emit('ui.update.power', [device_model]);
        
                eventbus.emit('device.snapshot', [device_model]);
            }

            if (lastmessage.command.startsWith ('gM')) {
            
                var re = data.split(';');

                device_model.runmode = re[0].trim();
                
                eventbus.emit('ui.update.runmode', [device_model]);
            }

            if (lastmessage.command.startsWith ('gUp')) {
            
                var re = data.split(';');

                device_model.pressureunit = re[0].trim();
                
                eventbus.emit('ui.update.pressureunit', [device_model]);
            }

            if (lastmessage.command.startsWith ('gV')) {
            
                var re = data.split(';');

                device_model.ventilation = re[0].trim();
                
                eventbus.emit('ui.update.ventilation', [device_model]);
            }

            if (lastmessage.command.startsWith ('gW')) {
            
                var re = data.split(';');

                device_model.coolant = re[0].trim();
                
                eventbus.emit('ui.update.coolant', [device_model]);
            }
        
        });

        eventbus.on ("device.set.runmode", function(data) {
            eventbus.emit ("device.command", [{"command": "cM"+data}])
        });

        eventbus.on ("device.set.startstop", function(data) {
            eventbus.emit ("device.command", [{"command": "d"+data}])
        });

        eventbus.on ("device.set.pressureunit", function(data) {
            eventbus.emit ("device.command", [{"command": "cUp"+data}])
        });

        eventbus.on ("device.set.ventilation", function(data) {
            eventbus.emit ("device.command", [{"command": "dV"+data}])
        });

        eventbus.on ("device.set.coolant", function(data) {
            eventbus.emit ("device.command", [{"command": "dW"+data}])
        });

        eventbus.emit ("device.initialized", []);
    };


})(typeof exports == 'undefined'? this['device'] = {}: exports);