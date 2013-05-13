
(function(exports) {

    var device_model = {

        runmode: 'n',
        pressure: '0',
        setpoint: '0',
        power: '0',
        ventilation: '0',
        coolant: '0',
        runtime: '0',

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

        pressureunit: '0'
    };


    var datacurve = new Array();

    exports.init = function (eventbus) {

        if (typeof String.prototype.startsWith != 'function') {
            String.prototype.startsWith = function (str){
                return this.indexOf(str) == 0;
            };
        }

        eventbus.on ("device.initialized", function () {

        });

        eventbus.on ("device.snapshot", function (param) {

            if (device_model.runtime == "0.0") {
                if (datacurve.length > 10) {
                    datacurve.shift();
                }
            }

            var tm = (new Date()).getTime();
            var pr = parseInt(param.pressure);

            var datapoint = [tm, pr];
            datacurve.push (datapoint);

            eventbus.emit ("ui.refreshdatacurve", [datacurve]);

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

                try {

                var re = ("" + data).split(';');

                device_model.runtime = re[0].trim();
                device_model.pressure = re[1].trim();
                device_model.setpoint = re[2].trim();
                device_model.power = re[3].trim();

                eventbus.emit('ui.update.runtime', [device_model]);
                eventbus.emit('ui.update.pressure', [device_model]);
                eventbus.emit('ui.update.setpoint', [device_model]);
                eventbus.emit('ui.update.power', [device_model]);
        
                eventbus.emit('device.snapshot', [device_model]);

                } catch (e) {

                }
            }

            if (lastmessage.command.startsWith ('gM')) {
            
                try {

                    var re = ("" + data).split(';');

                device_model.runmode = re[0].trim();
                
                eventbus.emit('ui.update.runmode', [device_model]);

                } catch (e) {
                    
                }
            }

            if (lastmessage.command.startsWith ('gUp')) {

                try {
            
                var re = ("" + data).split(';');

                device_model.pressureunit = re[0].trim();
                
                eventbus.emit('ui.update.pressureunit', [device_model]);

                } catch (e) {

                }
            }

            if (lastmessage.command.startsWith ('gV')) {

                try {
            
                var re = ("" + data).split(';');

                device_model.ventilation = re[0].trim();
                
                eventbus.emit('ui.update.ventilation', [device_model]);
                } catch (e) {

                }
            }

            if (lastmessage.command.startsWith ('gW')) {

                try {
            
                var re = ("" + data).split(';');

                device_model.coolant = re[0].trim();
                
                eventbus.emit('ui.update.coolant', [device_model]);

                } catch (e) {
                    
                }
            }
        
             if (lastmessage.command.startsWith ('gFv')) {
                
                var re = ("" + data).split(';');

                if (re.length > 4) {
                
                var x = re[0].trim();
                device_model.jashon[x].jso_time = re[1].trim();
                device_model.jashon[x].jso_pressure = re[2].trim();
                device_model.jashon[x].jso_coolant = re[3].trim();

                eventbus.emit('ui.update.functionrow', [x, device_model]);

                
                } else {
                    console.log ('wrong reply gFv');
                console.log (lastmessage);
                console.log (data);

                }

                
            }

        if (lastmessage.command.startsWith ('cFd') || lastmessage.command.startsWith ('cFc') || lastmessage.command.startsWith ('cFs')) {
             
                eventbus.emit('device.update.list', [device_model]);
            }
        
        });

        eventbus.on ("device.update.list", function (device_model) {;

            for(index = 0; index < 12 ; index ++)
            {
            
            localeventbus.emit ("device.update.row", [index]);
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

         eventbus.on ("device.set.power", function(data) {
            eventbus.emit ("device.command", [{"command": "cS"+data}])
        });

         eventbus.on ("device.set.pressure", function(data) {
            eventbus.emit ("device.command", [{"command": "cC"+data}])
        });

         eventbus.on ("device.update.row", function(data) {

              eventbus.emit ("device.command", [{"command": "gFv"+data}])
        });

         eventbus.on ("device.set.function", function(temp_obj , o1, o2, o3) {
            
            var main_i = parseInt(temp_obj);
            var main_t = o1;
            var main_p = o2;
            var main_c = o3;
            eventbus.emit ("device.command", [{"command": "cFs "+main_i+";"+main_t+";"+main_p+";"+main_c+";"}]);


        });

          eventbus.on ("device.delAll.function", function(temp_obj_2) {
            
            eventbus.emit ("device.command", [{"command": "cFd "+temp_obj_2+";"}]);

        });

           eventbus.on ("device.del1.function", function(temp_obj_3) {
            
            eventbus.emit ("device.command", [{"command": "cFc "+temp_obj_3+";"}]);

        });

        eventbus.emit ("device.initialized", []);
    };


})(typeof exports == 'undefined'? this['device'] = {}: exports);