

var localeventbus;

exports.init = function (eventbus) {
    localeventbus = eventbus;
    

    localeventbus.on ("device.initialized", function () {

    	console.log ("device initialized");

    });

    localeventbus.on ("device.requestheartbeat", function () {

    	
    });

    localeventbus.on ("device.requestheartbeat.simulation", function () {

        localeventbus.emit ("serial_rawincoming", "20;31.4;25.3;976");
    	
    });

    localeventbus.on ("serial_received", function(lm, data) {

        localeventbus.emit('device_received', lm, data);        

        
    });

    localeventbus.on ("serial_rawincoming", function(data) {

        var re = data.split(';');

        if (re.length == 4) {

        var rotation = re[0].trim();

        var temperature = re[1].trim();
        var exttemp = re[2].trim();
        var vacuum = re[3].trim();

        newdata = {'rotation': rotation, 'temperature': temperature, 'externaltemperature': exttemp, 'vacuum': vacuum}
      
     
        localeventbus.emit('device_log', {'commandtype': 'heartbeat', 'command': 'heartbeat', 'device_id': '1'}, newdata);
        }
        
    });

    localeventbus.on ("device_received", function(lm, data) {
        

    });
    

	localeventbus.emit ("device.initialized");
};

