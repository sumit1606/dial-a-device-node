(function(exports) {

    var device_model = {

        weight:'0',
        autoprint :'0',
        powmeter:'0'

    };

    exports.init = function (eventbus) {

        if (typeof String.prototype.startsWith != 'function') {
            String.prototype.startsWith = function (str){
                return this.indexOf(str) == 0;
            };
        }

        eventbus.on ("device.initialized", function () {

        });

        eventbus.on ("device.updatemodel", function (param) {

            device_model = param[0];

            eventbus.emit('ui.update.power', [device_model]);
            eventbus.emit('ui.update.autoprint', [device_model]);

        });

         eventbus.on ("device.set.energy", function(ene) {

            

            if (typeof ene == 'string') {
                msg = ene;
            }
            else {
                msg = ene[0];
            }


          if(msg=="1") {

            eventbus.emit ("device.immediatecommand", [{"command": "Q"}]);

            device_model.powmeter='1';
            eventbus.emit('ui.update.power', [device_model]);
            eventbus.emit('device.snapshot', [device_model]);

            } 
          else{

                eventbus.emit ("device.immediatecommand", [{"command": "Q"}]); 
                device_model.powmeter='0';
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
                eventbus.emit('ui.update.display1', [device_model]);

                 device_model.powmeter='1';
            eventbus.emit('ui.update.power', [device_model]);

            eventbus.emit('device.snapshot', [device_model]);
             }
            
        

            if (lastmessage.command.startsWith ('D')) {
            
                try {

                    var re = data ;
                    console.log("the data to be dispayed is"+data);

                device_model.weight = re ;
                eventbus.emit('ui.update.display1', [device_model]);
                 device_model.powmeter='1';
            eventbus.emit('ui.update.power', [device_model]);
            eventbus.emit('device.snapshot', [device_model]);
                } catch (e) {
                    
                }
            }

        });

    };   

})(typeof exports == 'undefined'? this['device'] = {}: exports);