(function(exports) {

	var device_model_simulation = {

        runmode: '0',
        pressure: '700',
        setpoint: '300',
        power: '10',
        ventilation: '0',
        coolant: '0',
        runtime: '0.0',
        pressureunit: '0',
        jashon: [
                        { "jso_time":"52" , "jso_pressure":"20" , "jso_coolant":"2"  }, 
                        { "jso_time":"34" , "jso_pressure":"54" , "jso_coolant":"1"  }, 
                        { "jso_time":"68" , "jso_pressure":"44" , "jso_coolant":"2"  }, 
                        { "jso_time":"69" , "jso_pressure":"89" , "jso_coolant":"2"  }, 
                        { "jso_time":"15" , "jso_pressure":"89" , "jso_coolant":"1"  }, 
                        { "jso_time":"78" , "jso_pressure":"55" , "jso_coolant":"2"  }, 
                        { "jso_time":"98" , "jso_pressure":"21" , "jso_coolant":"2"  }, 
                        { "jso_time":"96" , "jso_pressure":"85" , "jso_coolant":"1"  }, 
                        { "jso_time":"75" , "jso_pressure":"18" , "jso_coolant":"2"  }, 
                        { "jso_time":"87" , "jso_pressure":"10" , "jso_coolant":"1"  }, 
                        { "jso_time":"98" , "jso_pressure":"25" , "jso_coolant":"2"  }, 
                        { "jso_time":"32" , "jso_pressure":"19" , "jso_coolant":"1"  }
                     ],
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

             if (message.command.startsWith ('gFv')) {
                data = "1";
                value = message.command.substr(3);
                splitter = value.split(';');
                index_chk = parseInt(splitter[0].trim());
                data = index_chk +";"+ device_model_simulation.jashon[index_chk].jso_time + ";" + device_model_simulation.jashon[index_chk].jso_pressure +" ; "+ device_model_simulation.jashon[index_chk].jso_coolant +";1" ;
            }
            // set

            if (message.command.startsWith ('cM')) {
            	value = message.command.substr(2);

                switch ( value ) {

                        case 'n' : 
                                  value = "0";

                                 break;
                        case 'r' : 
                                  value = "1";
                                break;
                        case 'a' : 
                                 value = "2";
                                 break;
                        case 'f' : 
                                  value = "3";
                                  break;
                        }

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

             if (message.command.startsWith ('cS')) {
                
                value = message.command.substr(2);
                device_model_simulation.power = value;
            }

             if (message.command.startsWith ('cC')) {
                
                value = message.command.substr(2);

                device_model_simulation.setpoint = value;
            }

             if (message.command.startsWith ('cFs')) {
                

                value = message.command.substr(3);
                 splitter = value.split(';');
                 index_chk = parseInt(splitter[0].trim());
               
                device_model_simulation.jashon[index_chk].jso_time = splitter[1].trim();
                device_model_simulation.jashon[index_chk].jso_pressure = splitter[2].trim();
                device_model_simulation.jashon[index_chk].jso_coolant = splitter[3].trim();

                
            }


             if (message.command.startsWith ('cFd')) {
          
                value = message.command.substr(3);
                splitter = value.split(';');
                 index_chk = parseInt(splitter[0].trim());
                for(i=index_chk ; i<11 ; i++)
            {
                device_model_simulation.jashon[i].jso_time = device_model_simulation.jashon[i + 1].jso_time ;
                device_model_simulation.jashon[i].jso_pressure = device_model_simulation.jashon[i + 1].jso_pressure ;
                device_model_simulation.jashon[i].jso_coolant = device_model_simulation.jashon[i + 1].jso_coolant ;
                
            }
                device_model_simulation.jashon[11].jso_time = "";
                device_model_simulation.jashon[11].jso_pressure = "";
                device_model_simulation.jashon[11].jso_coolant = "";
            }

             if (message.command.startsWith ('cFc')) {
                
                value = message.command.substr(3);
                splitter = value.split(';');
                index_chk = parseInt(splitter[0].trim());
                for(i=index_chk ; i<12 ; i++)
            {
                device_model_simulation.jashon[i].jso_time = "";
                device_model_simulation.jashon[i].jso_pressure = "" ;
                device_model_simulation.jashon[i].jso_coolant ="";
            }           
            }

            eventbus.emit ("device.reply", [message, data]);
    	});

	
    };

})(typeof exports == 'undefined'? this['simulator'] = {}: exports);