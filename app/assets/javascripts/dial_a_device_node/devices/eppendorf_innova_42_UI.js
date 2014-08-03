(function (exports) {

    exports.init = function (eventbus) {

        eventbus.on("ui.update", function (data) {

            g1.refresh(data.model.temperature);

            g2.refresh(data.model.rotation);


            if (!$('#temperature_setpoint_input').hasClass("dontupdate")) {
                $('#temperature_setpoint_input').val(data.model.temperature_setpoint);
            }

            if (!$('#rotation_setpoint_input').hasClass("dontupdate")) {
                $('#rotation_setpoint_input').val(data.model.rotation_setpoint);
            }

        });



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