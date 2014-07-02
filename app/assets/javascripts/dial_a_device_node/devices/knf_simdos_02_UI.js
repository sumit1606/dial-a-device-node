(function (exports) {

    exports.init = function (eventbus) {

        eventbus.on("ui.update", function (data) {

            g1.refresh(data.model.amount * 1000);
            g2.refresh(data.model.flowrate);

            document.getElementById("amountcounter").innerHTML = data.model.amountcounter + " ul";

            document.getElementById("timecounter").innerHTML = data.model.timecounter + "s";

            switch (parseInt(data.model.runmode)) {
                case 0:
                    $('#startstopicon').removeClass('glyphicon-play');
	                $('#startstopicon').addClass('glyphicon-stop');
	                $('#startstop').addClass('active');

	                
                    break;

                case 1:
                    $('#startstopicon').removeClass('glyphicon-stop');
	                $('#startstopicon').addClass('glyphicon-play');
	                $('#startstop').removeClass('active');

	                
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

    exports.toggleStartstop = function toggleStartstop() {
        if ($('#startstop').hasClass('active')) {
            data = 0;
        } else {
            data = 1;
        }
        localeventbus.emit("ui.command", {
            "command": "set_function",
            "value": data
        });

    };

})(typeof exports == 'undefined' ? this['ui'] = {} : exports);