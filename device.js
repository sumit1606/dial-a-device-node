

var localeventbus;

exports.init = function (eventbus) {
    localeventbus = eventbus;
    localeventbus.emit ("device_initialized");

};

exports.serialdata = function (lm, data) {
    localeventbus.emit('device_received', lm, data);		

	if (lm.command == ('pP')) {

		var re = data.split(';');

		runtime = parseFloat(re[0].trim());

		var currentpressure = re[1].trim();
		var targetpressure = re[2].trim();
		var pumppower = re[3].trim();

		newdata = {'runtime': runtime, 'pressure': currentpressure, 'setpoint': targetpressure, 'power': pumppower}
		
		localeventbus.emit('device_log', {'commandtype': 'heartbeat', 'command': 'pP', 'device_id': '1'}, newdata)

	}

  };
  
