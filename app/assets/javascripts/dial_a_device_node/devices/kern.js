(function(exports) {

    var device_model = {

        weight:'0.000[0]g',
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

        eventbus.on ("device.updatemodel", function (param) {

            device_model = param;

            eventbus.emit('ui.update', {"component": "all", "model": device_model});
            
        });

        eventbus.on ("device.command", function(data) {

            if (data.command == "power") {

                eventbus.emit ("device.immediatecommand", {"command": "Q"});

                device_model.power = '' + data.value;

                eventbus.emit('ui.update', {"component": "all", "model": device_model});

            }

            if (data.command == "calibration") {

                eventbus.emit ("device.immediatecommand", {"command": "CAL"});

                eventbus.emit('ui.update', {"component": "all", "model": device_model});

            }

            if (data.command == "tare") {

                eventbus.emit ("device.immediatecommand", {"command": "T"});

                eventbus.emit('ui.update', {"component": "all", "model": device_model});

            }

            if (data.command == "print") {

                eventbus.emit ("device.command", {"command": "D05"});

            }

            if (data.command == "autoprint") {

                if(data.value == "1") {
            
                    eventbus.emit ("device.immediatecommand", {"command": "D06"});

                    device_model.autoprint='1';

                    eventbus.emit('ui.update', {"component": "all", "model": device_model});
                } 
                else {  
                    eventbus.emit ("device.immediatecommand", {"command": "D09"}); 

                    device_model.autoprint='0';

                    eventbus.emit('ui.update', {"component": "all", "model": device_model});
                   
                 }

            }

            if (data.command == "reset") {

                eventbus.emit ("device.immediatecommand", {"command": "R"});

            }



        });        


        eventbus.on ("device.reply", function(lastmessage, data) {

            eventbus.emit('device.assumeconnected');

             if (lastmessage.startsWith ('heartbeat')) {
                device_model.weight = data ;
                device_model.power='1';

                eventbus.emit('ui.update', {"component": "all", "model": device_model});

                eventbus.emit('device.snapshot', device_model);
             }


            if (lastmessage.startsWith ('D')) {
                device_model.weight = data ;
                device_model.power='1';

                eventbus.emit('ui.update', {"component": "all", "model": device_model});

                eventbus.emit('device.snapshot', device_model);
             }
  

        });

    };   

})(typeof exports == 'undefined'? this['device'] = {}: exports);