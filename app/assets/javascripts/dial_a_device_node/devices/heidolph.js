(function(exports) {

    var device_model = {

        temperature: '0',
        exttemperature: '0',
        rotation: '0',
        vacuum: '0'

    };

    exports.init = function (eventbus) {

        if (typeof String.prototype.startsWith != 'function') {
            String.prototype.startsWith = function (str){
                return this.indexOf(str) == 0;
            };
        }

        eventbus.on ("device.initialized", function () {

        });

        eventbus.on ("device.requestheartbeat", function () {

        });

        eventbus.on ("serial.received", function(lm, data) {
            eventbus.emit('device.received', [lm, data]);        
        });

        eventbus.on ("device.updatemodel", function (param) {

            device_model = param[0];

            eventbus.emit('ui.update.rotation', [device_model]);
            eventbus.emit('ui.update.temperature', [device_model]);
            eventbus.emit('ui.update.exttemperature', [device_model]);
            eventbus.emit('ui.update.vacuum', [device_model]);
        });

        eventbus.on ("device.reply", function(params, data) {


            if (typeof params.command == 'string') {
                lastmessage = params;
            }
            else {
                lastmessage = params[0];
                data = params[1];
            }

             if (lastmessage.command.startsWith ('heartbeat')) {
                var re = data.split(';');

                if (re.length == 4) {

                    device_model.rotation = re[0].trim();
                    device_model.temperature = re[1].trim();
                    device_model.exttemperature = re[2].trim();
                    device_model.vacuum = re[3].trim();

                    eventbus.emit('ui.update.rotation', [device_model]);
                    eventbus.emit('ui.update.temperature', [device_model]);
                    eventbus.emit('ui.update.exttemperature', [device_model]);
                    eventbus.emit('ui.update.vacuum', [device_model]);
            
                    eventbus.emit('device.snapshot', [device_model]);
                }
             }

        });
   

	   eventbus.emit ("device.initialized", []);

    };


})(typeof exports == 'undefined'? this['device'] = {}: exports);