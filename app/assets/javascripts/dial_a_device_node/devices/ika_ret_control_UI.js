(function (exports) {

    exports.init = function (eventbus) {

        eventbus.on("ui.update", function (data) {

            g1.refresh(data.model.temperature);

            g2.refresh(data.model.rotation);

            switch (parseInt(data.model.heater_status)) {
                case 2:
                    $('#heatericon').removeClass('glyphicon-fire');
                    $('#heaterbutton').removeClass('active');
                    break;

                case 1:
                    $('#heatericon').addClass('glyphicon-fire');
                    $('#heaterbutton').addClass('active');
                    break;
            }

            switch (parseInt(data.model.stirrer_status)) {
                case 2:
                    $('#stirrericon').removeClass('glyphicon-flash');
                    $('#stirrerbutton').removeClass('active');
                    break;

                case 1:
                    $('#stirrericon').addClass('glyphicon-flash');
                    $('#stirrerbutton').addClass('active');
                    break;
            }


            if (!$('#temperature_setpoint_input').hasClass("dontupdate")) {
                $('#temperature_setpoint_input').val(data.model.temperature_setpoint);
            }

            if (!$('#rotation_setpoint_input').hasClass("dontupdate")) {
                $('#rotation_setpoint_input').val(data.model.rotation_setpoint);
            }

        });



    };



    exports.toggleHeater = function toggleHeater() {
        if ($('#heaterbutton').hasClass('active')) {
            localeventbus.emit("ui.command", {
            	"command": "stop_heater"
        	});
        } else {
            localeventbus.emit("ui.command", {
            	"command": "start_heater"
        	});
        }

    };

    exports.toggleStirrer = function toggleStirrer() {
        if ($('#stirrerbutton').hasClass('active')) {
            localeventbus.emit("ui.command", {
            	"command": "stop_stirrer"
        	});
        } else {
            localeventbus.emit("ui.command", {
            	"command": "start_stirrer"
        	});
        }

    };

    exports.setTemperatureSetpoint = function setTemperatureSetpoint(val) {

    	localeventbus.emit("ui.command", {
            	"command": "set_temperature_setpoint",
            	"value": parseFloat(val)
        	});

    };

    exports.setRotationSetpoint = function setRotationSetpoint(val) {

    	localeventbus.emit("ui.command", {
            	"command": "set_rotation_setpoint",
            	"value": parseFloat(val)
        	});

    };

})(typeof exports == 'undefined' ? this['ui'] = {} : exports);