(function (exports) {

    exports.init = function (eventbus) {

        eventbus.on("ui.update", function (data) {

            g1.refresh(data.model.temperature);

            g2.refresh(data.model.rotation);

            g3.refresh(data.model.lift);

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

            switch (parseInt(data.model.rotation_status)) {
                case 2:
                    $('#rotationicon').removeClass('glyphicon-refresh');
                    $('#rotationbutton').removeClass('active');
                    break;

                case 1:
                    $('#rotationicon').addClass('glyphicon-refresh');
                    $('#rotationbutton').addClass('active');
                    break;
            }


            if (!$('#temperature_setpoint_input').hasClass("dontupdate")) {
                $('#temperature_setpoint_input').val(data.model.temperature_setpoint);
            }

            if (!$('#rotation_setpoint_input').hasClass("dontupdate")) {
                $('#rotation_setpoint_input').val(data.model.rotation_setpoint);
            }

            if (!$('#lift_setpoint_input').hasClass("dontupdate")) {
                $('#lift_setpoint_input').val(data.model.lift_setpoint);
            }

            switch (parseInt(data.model.coolant_valve)) {
                case 0:
                    $('#coolanticon').removeClass('glyphicon-star-empty');
                    $('#coolanticon').addClass('glyphicon-star');
                    $('#coolantbutton').removeClass('active');
                    break;

                case 1:
                    $('#coolanticon').removeClass('glyphicon-star');
                    $('#coolanticon').addClass('glyphicon-star-empty');
                    $('#coolantbutton').addClass('active');
                    break;
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

    exports.toggleRotation = function toggleRotation() {
        if ($('#rotationbutton').hasClass('active')) {
            localeventbus.emit("ui.command", {
                "command": "stop_rotation"
            });
        } else {
            localeventbus.emit("ui.command", {
                "command": "start_rotation"
            });
        }

    };

    exports.toggleCoolant = function toggleCoolant() {
        if ($('#coolantbutton').hasClass('active')) {
            localeventbus.emit("ui.command", {
                "command": "set_coolant_off"
            });
        } else {
            localeventbus.emit("ui.command", {
                "command": "set_coolant_on"
            });
        }

    };

    exports.Stop = function Stop() {
        
            localeventbus.emit("ui.command", {
                "command": "stop"
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

    exports.setLiftSetpoint = function setLiftSetpoint(val) {

        localeventbus.emit("ui.command", {
                "command": "set_lift_setpoint",
                "value": parseFloat(val)
            });

    };

    exports.liftUp = function liftUp() {

        localeventbus.emit("ui.command", {
                "command": "start_lift_up"
            });

    };

    exports.liftUpStop = function liftUpStop() {

        localeventbus.emit("ui.command", {
                "command": "stop_lift_up"
            });

    };

    exports.liftDown = function liftDown() {

        localeventbus.emit("ui.command", {
                "command": "start_lift_down"
            });

    };

    exports.liftDownStop = function liftDownStop() {

        localeventbus.emit("ui.command", {
                "command": "stop_lift_down"
            });

    };

})(typeof exports == 'undefined' ? this['ui'] = {} : exports);