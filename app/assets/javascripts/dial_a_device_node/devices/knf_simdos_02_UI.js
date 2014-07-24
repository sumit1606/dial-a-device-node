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

                    $('#start').removeClass('active');
                    $('#pause').removeClass('active');

                    $('#stop').addClass('active');
                
                    break;

                case 1:

                    // START

                    $('#start').addClass('active');
                    $('#pause').removeClass('active');

                    $('#stop').removeClass('active');
	                
                    break;

                case 3:

                    // PAUSE
                    $('#start').removeClass('active');
                    $('#pause').addClass('active');

                    $('#stop').removeClass('active');
                    break;
            }

            switch ((data.model.runmode)) {
                case 0:
                    $('#runmode').text('Run Mode');

                    $("#tab2").show();
                    $("#tab3").hide();
                    $("#tab4").hide();
 
                    break;
                case 1:
                    $('#runmode').text('Dispense Mode ml');

                    $("#tab2").hide();
                    $("#tab3").show();
                    $("#tab4").hide();
                    break;
                case 2:
                    $('#runmode').text('Dispense Mode ml/min');

                    $("#tab2").hide();
                    $("#tab3").hide();
                    $("#tab4").show();
                    break;
                
            }

            if (!$('#amount_input').hasClass("dontupdate")) {
                $('#amount_input').val(data.model.amount);
            }

            if (!$('#flowrate_input').hasClass("dontupdate")) {
                $('#flowrate_input').val(data.model.flowrate);
            }

            if (!$('#time_input').hasClass("dontupdate")) {
                $('#time_input').val(data.model.time);
            }


        });

    };

    exports.setRunmode = function setRunmode(data) {

        localeventbus.emit("ui.command", {
            "command": "set_runmode",
            "value": data
        });
    };

    exports.toggleStart = function toggleStartPause() {

        localeventbus.emit("ui.command", {
            "command": "set_function",
            "value": 1
        });

    };

    exports.togglePause = function toggleStartPause() {

        localeventbus.emit("ui.command", {
            "command": "set_function",
            "value": 3
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

    exports.setFlowrate = function setFlowrate(data) {

        localeventbus.emit("ui.command", {
            "command": "set_flowrate",
            "value": data
        });

    };

    exports.setAmount = function setAmount(data) {

        localeventbus.emit("ui.command", {
            "command": "set_amount",
            "value": data
        });

    };


    exports.setTime = function setTime(data) {

        localeventbus.emit("ui.command", {
            "command": "set_time",
            "value": data
        });

    };

})(typeof exports == 'undefined' ? this['ui'] = {} : exports);