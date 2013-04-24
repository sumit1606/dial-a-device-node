(function(exports) {

	var device_model_simulation = {

        runmode: 'n',
        pressure: '700',
        setpoint: '300',
        power: '10',
        ventilation: '0',
        coolant: '0',
        runtime: '0.0',
        pressureunit: '0',

        pumpengine: false

    };

    exports.init = function (eventbus) {
 
        setInterval (function() {

            eventbus.emit ("device.heartbeat", []);

        }, 1000);

        setInterval (function() {

            // simulation tick

            if (device_model_simulation.pumpengine) {

            	var rt = parseFloat(device_model_simulation.runtime) + 0.5;
            	device_model_simulation.runtime = rt;

            }

        }, 500);

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

            if (message.command.startsWith ('pP')) {
            	data = device_model_simulation.runtime + ";" 
            		+ device_model_simulation.pressure + ";"
            		+ device_model_simulation.setpoint + ";"
            		+ device_model_simulation.power + ";"
            		+ "  50";
            }

            if (message.command.startsWith ('gM')) {
            	data = device_model_simulation.runmode + ";"
            		+ "  1";
            }

            if (message.command.startsWith ('gUp')) {
            	data = device_model_simulation.pressureunit + ";"
            		+ "  1";
            }

            if (message.command.startsWith ('gV')) {
            	data = device_model_simulation.ventilation + ";"
            		+ "  1";
            }

            if (message.command.startsWith ('gW')) {
            	data = device_model_simulation.coolant + ";"
            		+ "  1";
            }

            // set

            if (message.command.startsWith ('cM')) {
            	value = message.command.substr(2);
            	device_model_simulation.runmode = value;
            }

            if (message.command.startsWith ('cUp')) {
            	value = message.command.substr(3);
            	device_model_simulation.pressureunit = value;
            }

            if (message.command.startsWith ('dV')) {
            	value = message.command.substr(2);
            	device_model_simulation.ventilation = value;
            }

            if (message.command.startsWith ('dW')) {
            	value = message.command.substr(2);
            	device_model_simulation.coolant = value;
            }

            if (message.command.startsWith ('dB')) {
            	device_model_simulation.pumpengine = true;
            }

            if (message.command.startsWith ('dE')) {
            	device_model_simulation.pumpengine = false;
            	device_model_simulation.runtime = "0.0";
            }

            eventbus.emit ("device.reply", [message, data]);
    	});

	
    };

})(typeof exports == 'undefined'? this['simulator'] = {}: exports);