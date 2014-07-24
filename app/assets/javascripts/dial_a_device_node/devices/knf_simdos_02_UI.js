(function (exports) {

    exports.init = function (eventbus) {

        eventbus.on("ui.update", function (data) {

            g1.refresh(data.model.amount * 1000);
            g2.refresh(data.model.flowrate);

            document.getElementById("amountcounter").innerHTML = data.model.amountcounter + " ul";

            document.getElementById("timecounter").innerHTML = data.model.timecounter + "s";

            switch (parseInt(data.model.runfunction)) {
                case 0:

                    // STOP

                    $('#runicon').removeClass('glyphicon-play');
                    $('#runicon').removeClass('glyphicon-stop');
                    $('#runicon').removeClass('glyphicon-pause');

                    $('#startpauseicon').removeClass('glyphicon-start');
                    $('#startpauseicon').removeClass('glyphicon-pause');

	                $('#runicon').addClass('glyphicon-stop');
                    $('#startpauseicon').addClass('glyphicon-start');

                    $('#startpause').removeClass('active');
                
                    break;

                case 1:

                    // START
                    $('#runicon').removeClass('glyphicon-play');
                    $('#runicon').removeClass('glyphicon-stop');
                    $('#runicon').removeClass('glyphicon-pause');

                    $('#startpauseicon').removeClass('glyphicon-start');
                    $('#startpauseicon').removeClass('glyphicon-pause');

	                $('#runicon').addClass('glyphicon-play');
                    $('#startpauseicon').addClass('glyphicon-pause');

                    $('#startpause').addClass('active');
	                
                    break;

                case 3:

                    // PAUSE
                    $('#runicon').removeClass('glyphicon-play');
                    $('#runicon').removeClass('glyphicon-stop');
                    $('#runicon').removeClass('glyphicon-pause');

                    $('#startpauseicon').removeClass('glyphicon-start');
                    $('#startpauseicon').removeClass('glyphicon-pause');

                    $('#runicon').addClass('glyphicon-pause');
                    $('#startpauseicon').addClass('glyphicon-start');

                    $('#startpause').removeClass('active');

                    break;
            }

            switch ((data.model.runmode)) {
                case 0:
                    $('#runmode').text('Run Mode');
 
                    break;
                case 1:
                    $('#runmode').text('Dispense Mode ml');
                    break;
                case 2:
                    $('#runmode').text('Dispense Mode ml/min');
                    break;
                
            }

        });

    };

    exports.setRunmode = function setRunmode(data) {

        localeventbus.emit("ui.command", {
            "command": "set_runmode",
            "value": data
        });
    };

    exports.toggleStartPause = function toggleStartPause() {
        if ($('#startpause').hasClass('active')) {
            data = 1;
        } else {
            data = 3;
        }
        localeventbus.emit("ui.command", {
            "command": "set_function",
            "value": data
        });

    };

    exports.toggleStop = function toggleStop() {

        localeventbus.emit("ui.command", {
            "command": "set_function",
            "value": 0
        });

    };

    exports.togglePrimeDrain = function togglePrimeDrain() {

        localeventbus.emit("ui.command", {
            "command": "set_function",
            "value": 2
        });

    };

})(typeof exports == 'undefined' ? this['ui'] = {} : exports);