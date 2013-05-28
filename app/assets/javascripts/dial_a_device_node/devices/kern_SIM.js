(function(exports) {

	var device_model_simulation = {

        weight:'10',

    };

    exports.init = function (eventbus) {
 

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

             if (message.command.startsWith ('D05')) {
                data = device_model_simulation.weight ;

            }
            
            if (message.command.startsWith ('T')) {
                device_model_simulation.weight ='0';
                data = device_model_simulation.weight;

            }
           
            if (message.command.startsWith ('R')) {
                device_model_simulation.weight ='0';
                data = device_model_simulation.weight;

            }

            if (message.command.startsWith ('D06')) {
                device_model_simulation.weight ='25';
                setInterval (function() {
                  var oldweight = parseInt(device_model_simulation.weight);
                        var newweight = oldweight + 1;
                   device_model_simulation.weight = newweight.toString();
                   data=  device_model_simulation.weight;
                    }
        }, 1000);

            if (message.command.startsWith ('D09')) {
                device_model_simulation.weight ='45';
                data = device_model_simulation.weight;

            }


            }
             



            eventbus.emit ("device.reply", [data]);

        });
	
    };

})(typeof exports == 'undefined'? this['simulator'] = {}: exports);