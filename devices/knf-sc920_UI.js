
(function(exports) {

	var localeventbus;

	exports.init = function (eventbus) {

		localeventbus = eventbus;

    	eventbus.on ("ui.update.runtime", function(device_model) {
        	runtime = parseFloat(device_model.runtime);

			if (runtime > 0) {
				$('#startstopicon').removeClass('icon-play');
				$('#startstopicon').addClass('icon-stop');
				$('#startstop').addClass('active');
			} else {
				$('#startstopicon').removeClass('icon-stop');
				$('#startstopicon').addClass('icon-play');
				$('#startstop').removeClass('active');
		    }
    	});

    	eventbus.on ("ui.update.pressure", function (device_model) {
    		$('#pressure').text(device_model.pressure);
    	});

    	eventbus.on ("ui.update.power", function (device_model) {
    		$('#textb').val(parseInt(device_model.power));
    	});

    	eventbus.on ("ui.update.setpoint", function (device_model) {
    		$('#textb2').val(parseInt(device_model.setpoint));
    	});

    	eventbus.on ("ui.update.ventilation", function (device_model) {
    		switch (parseInt(device_model.ventilation)) {
					case 0: $('#ventilationicon').removeClass('icon-star-empty');
					$('#ventilationicon').addClass('icon-star');
					$('#ventilationbutton').removeClass('active'); break;

					case 1: $('#ventilationicon').removeClass('icon-star');
					$('#ventilationicon').addClass('icon-star-empty');
					$('#ventilationbutton').addClass('active'); break;
					
				}
    	});

    	eventbus.on ("ui.update.coolant", function (device_model) {
    		switch (parseInt(device_model.coolant)) {
					case 0: $('#coolanticon').removeClass('icon-star-empty');
					$('#coolanticon').addClass('icon-star');
					$('#coolantbutton').removeClass('active'); break;

					case 1: $('#coolanticon').removeClass('icon-star');
					$('#coolanticon').addClass('icon-star-empty');
					$('#coolantbutton').addClass('active'); break;
				}
    	});
				

    	eventbus.on ("ui.update.runmode", function (device_model) {
			switch (parseInt(device_model.runmode)) {
				case 0: $('#runmode').text('Evacuate'); $("#tab2").show(); $("#tab3").hide(); $("#tab4").hide(); $("#container").show(); break;
				case 1: $('#runmode').text('Pressure Control'); $("#tab2").hide(); $("#tab3").show(); $("#tab4").hide(); $("#container").show();   break;
				case 2: $('#runmode').text('Automatic'); $("#tab2").hide(); $("#tab3").hide(); $("#tab4").hide(); $("#container").show();  break; 
				case 3: $('#runmode').text('Function'); $("#tab2").hide(); $("#tab3").hide(); $("#tab4").show();  func_update(); $("#container").show(); break;
			}
    	});

    	eventbus.on ("ui.update.pressureunit", function (device_model) {
			switch (parseInt(device_model.pressureunit)) {
				case 0: $('#unitpressure').text('mbar'); break;
				case 1: $('#unitpressure').text('bar'); break;
				case 2: $('#unitpressure').text('hPa'); break;
				case 3: $('#unitpressure').text('Torr'); break;
			}
    	});

	};

	exports.setPressureunit = function setPressureunit(data) {
		localeventbus.emit ("device.set.pressureunit", [data])
	};

	exports.setRunmode = function setRunmode(data) {
		localeventbus.emit ("device.set.runmode", [data])
	};

	exports.setVentilation = function setVentilation(data) {
		localeventbus.emit ("device.set.ventilation", [data])
	};

	exports.setCoolant = function setCoolant(data) {
		localeventbus.emit ("device.set.coolant", [data])
	};

	exports.toggleStartstop = function toggleStartstop() {
		if ($('#startstop').hasClass('active')) {
			data = 'E';
		} else {
			data = 'B';
		}
		localeventbus.emit ("device.set.startstop", [data])
	};

	exports.toggleVentilation = function toggleVentilation() {
		if ($('#ventilationbutton').hasClass('active')) {
			data = '0';
		} else {
			data = '1';
		}
		localeventbus.emit ("device.set.ventilation", [data])
	}

	exports.toggleCoolant = function toggleCoolant() {
		if ($('#coolantbutton').hasClass('active')) {
			data = '0';
		} else {
			data = '1';
		}
		localeventbus.emit ("device.set.coolant", [data])
	}


})(typeof exports == 'undefined'? this['ui'] = {}: exports);