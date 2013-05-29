(function(exports) {

    var device_model = {

        weight:'0',
        autoprint :'0',
        power:'1'

    };

    exports.init = function (eventbus) {

        if (typeof String.prototype.startsWith != 'function') {
            String.prototype.startsWith = function (str){
                return this.indexOf(str) == 0;
            };
        }

        eventbus.on ("device.initialized", function () {

        });

      

        eventbus.on ("device.set.power", function(powermode) {

            if (typeof powermode == 'string') {
                msg = powermode;
            }
            else {
                msg = powermode[0];
            }


            if(msg=="1") {

                eventbus.emit ("device.immediatecommand", [{"command": "Q"}]);

                device_model.power='1';
                eventbus.emit('ui.update.power', [device_model]);
                eventbus.emit('device.snapshot', [device_model]);

            } else {

                eventbus.emit ("device.immediatecommand", [{"command": "Q"}]); 
                device_model.power='0';
                eventbus.emit('ui.update.power', [device_model]);

                eventbus.emit('device.snapshot', [device_model]);

            }

        });

        eventbus.on ("device.set.calibration", function() {
            eventbus.emit ("device.immediatecommand", [{"command": "CAL"}]);  
            
        });
       
         eventbus.on ("device.set.tare", function() {
            eventbus.emit ("device.immediatecommand", [{"command": "T"}]);
               
        });
        
        
        eventbus.on ("device.set.print", function() {
            eventbus.emit ("device.command", [{"command": "D05"}]);
          
        });
        
        eventbus.on ("device.set.autoprint", function(data) {
          if (typeof data == 'string') {
                msg = data;
            }
            else {
                msg = data[0];
            }
          if(msg=="1") {
            
            eventbus.emit ("device.immediatecommand", [{"command": "D06"}]);
            device_model.autoprint='1';
            eventbus.emit('ui.update.autoprint', [device_model]);
            } 
          else{ 
                eventbus.emit ("device.immediatecommand", [{"command": "D09"}]); 
                device_model.autoprint='0';
                eventbus.emit('ui.update.autoprint', [device_model]);
               
             }

         });
        
         eventbus.on ("device.set.reset", function() {
            eventbus.emit ("device.immediatecommand", [{"command": "R"}]);
   
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
                device_model.weight = data ;
                eventbus.emit('ui.update.display', [device_model]);

                device_model.power='1';
                eventbus.emit('ui.update.power', [device_model]);

                eventbus.emit('device.snapshot', [device_model]);
             }


            if (lastmessage.command.startsWith ('D')) {
                device_model.weight = data ;
                eventbus.emit('ui.update.display', [device_model]);

                device_model.power='1';
                eventbus.emit('ui.update.power', [device_model]);

                eventbus.emit('device.snapshot', [device_model]);
             }
  

        });

    };   

})(typeof exports == 'undefined'? this['device'] = {}: exports);