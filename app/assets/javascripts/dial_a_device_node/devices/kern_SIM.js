(function(exports) {

	var device_model_simulation = {

        power: "off"

    };

    exports.init = function (eventbus) {
 
        setInterval (function() {

            // every second ask for current weight
            eventbus.emit ("device.currentweight", ['0.500g']);
        
        }, 1000);

        eventbus.emit ("serial.simulation", []);
        eventbus.emit ("serial.portopened", []);

        if (typeof String.prototype.startsWith != 'function') {
            String.prototype.startsWith = function (str){
                return this.indexOf(str) == 0;
            };
        }

        eventbus.on ("device.command", function(params) {

            var data = "1";

            (typeof params.command == 'string'? message = params : message = params[0]);

            // get

            if (message.command.startsWith ('Q')) {
                data = "ok";
            }

            eventbus.emit ("device.reply", [message, data]);

        });
	
    };

})(typeof exports == 'undefined'? this['simulator'] = {}: exports);