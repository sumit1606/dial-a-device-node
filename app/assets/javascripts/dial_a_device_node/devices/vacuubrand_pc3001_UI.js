(function (exports) {


    function pad(n, width, z) {
          z = z || '0';
          n = n + '';
          return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
        }



    exports.init = function (eventbus) {

        eventbus.on("ui.update", function (data) {


            $('#pressure').text(data.model.current_pressure);

            if (!$('#si_speedsetpoint_input').hasClass("dontupdate")) {
                $('#si_speedsetpoint_input').val(parseInt(data.model.speedsetpoint));
            }

            if (!$('#si_pressuresetpoint_input').hasClass("dontupdate")) {
                $('#si_pressuresetpoint_input').val(parseInt(data.model.pressuresetpoint));
            }

            switch (parseInt(data.model.venting_valve)) {
                case 0:
                    $('#ventilationicon').removeClass('glyphicon-star-empty');
                    $('#ventilationicon').addClass('glyphicon-star');
                    $('#ventilationbutton').removeClass('active');
                    break;

                case 1:
                    $('#ventilationicon').removeClass('glyphicon-star');
                    $('#ventilationicon').addClass('glyphicon-star-empty');
                    $('#ventilationbutton').addClass('active');
                    break;

            }

            switch ((data.model.operation_mode)) {
                case 0:
                    $('#runmode').text('VACUU-LAN');
                    break;
                case 1:
                    $('#runmode').text('Pump down');
                    break;
                case 2:
                    $('#runmode').text('Vac control');
                    break;
            }

            switch (parseInt(data.model.pressure_unit)) {
                case 0:
                    $('#unitpressure').text('mbar');
                    break;
                case 1:
                    $('#unitpressure').text('Torr');
                    break;
                case 2:
                    $('#unitpressure').text('hPa');
                    break;
            }


            g1.refresh(data.model.current_pressure);
            g2.refresh(data.model.current_speed);

        
        });

    };

    exports.setRunmode = function setRunmode(data) {

        localeventbus.emit("ui.command", {
            "command": "set_runmode",
            "value": data
        });
    };


    exports.start = function start() {

        localeventbus.emit("ui.command", {
            "command": "set_start",
            "value": 1
        });

    };


    exports.stop = function stop() {

        localeventbus.emit("ui.command", {
            "command": "set_stop",
            "value": 0
        });

    };


    exports.setPressureSetpoint = function setPressureSetpoint(data) {

        localeventbus.emit("ui.command", {
            "command": "set_pressuresetpoint",
            "value": data
        });

    };

    exports.setSpeedSetpoint = function setSpeedSetpoint(data) {

        localeventbus.emit("ui.command", {
            "command": "set_speedsetpoint",
            "value": data
        });

    };

    exports.setPressureUnit = function setPressureUnit(data) {

        localeventbus.emit("ui.command", {
            "command": "set_pressureunit",
            "value": data
        });

    };

    exports.setVentValve = function setVentValve(data) {

        localeventbus.emit("ui.command", {
            "command": "set_ventvalve",
            "value": data
        });

    };

    exports.toggleVentValve = function toggleVentValve() {

        localeventbus.emit("ui.command", {
            "command": "toggle_ventvalve"
        });

    };



})(typeof exports == 'undefined' ? this['ui'] = {} : exports);