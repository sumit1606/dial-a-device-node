

var localeventbus;

exports.init = function (eventbus) {
    localeventbus = eventbus;
    

    localeventbus.on ("device.initialized", function () {

    	console.log ("device initialized");

    });

    localeventbus.on ("device.requestheartbeat", function () {

    	localeventbus.emit("channel.send", "device_sendmessage", {'commandtype': 'heartbeat', 'command': 'pP'});
    	localeventbus.emit("channel.send", "device_sendmessage", {'commandtype': 'heartbeat', 'command': 'gM'});
    	localeventbus.emit("channel.send", "device_sendmessage", {'commandtype': 'heartbeat', 'command': 'gUp'});
    	localeventbus.emit("channel.send", "device_sendmessage", {'commandtype': 'heartbeat', 'command': 'gV'});
    	localeventbus.emit("channel.send", "device_sendmessage", {'commandtype': 'heartbeat', 'command': 'gW'});

    });

    localeventbus.on ("device.requestheartbeat.simulation", function () {

    	localeventbus.emit("serial_received", {'commandtype': 'heartbeat', 'command': 'pP'}, ' 0.0; 799; 100; 50');

    });

    localeventbus.on ("serial_received", function(lm, data) {

        localeventbus.emit('device_received', lm, data);        

        
    });

    localeventbus.on ("serial_rawincoming", function(data) {
     

        
    });

    localeventbus.on ("device_received", function(lm, data) {
        
        if (lm.command == ('pP')) {

        var re = data.split(';');

        if (re.length >= 4) {

        var runtime = parseFloat(re[0].trim());

        var currentpressure = re[1].trim();
        var targetpressure = re[2].trim();
        var pumppower = re[3].trim();

        newdata = {'runtime': runtime, 'pressure': currentpressure, 'setpoint': targetpressure, 'power': pumppower}
        
        localeventbus.emit('device_log', {'commandtype': 'heartbeat', 'command': 'pP', 'device_id': '1'}, newdata);
        }
        }
    });
    

	localeventbus.emit ("device.initialized");
};

