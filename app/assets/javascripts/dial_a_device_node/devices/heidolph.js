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


        eventbus.on ("device.reply", function(lastmessage, data) {


             if (lastmessage.startsWith ('heartbeat')) {

                eventbus.emit('device.assumeconnected');

                var re = data.split(';');

                if (re.length == 4) {

                    device_model.rotation = re[0].trim();
                    device_model.temperature = re[1].trim();
                    device_model.exttemperature = re[2].trim();
                    device_model.vacuum = re[3].trim();

                    eventbus.emit('ui.update', {"component": "all", "model": device_model});
            
                    eventbus.emit('device.snapshot', device_model);
                }
             }

        });
   

	   eventbus.emit ("device.initialized");

    };


})(typeof exports == 'undefined'? this['device'] = {}: exports);