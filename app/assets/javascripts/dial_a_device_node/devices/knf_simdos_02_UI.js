(function (exports) {


    function pad(n, width, z) {
          z = z || '0';
          n = n + '';
          return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
        }



    exports.init = function (eventbus) {

        eventbus.on("ui.update", function (data) {


            document.getElementById("amountcounter").innerHTML = data.model.amountcounter + " &micro;l";

            var d = new Date();

            d.setTime(data.model.timecounter);

            document.getElementById("timecounter").innerHTML = pad(d.getUTCHours(), 2)+':'+pad(d.getUTCMinutes(), 2)+':'+pad(d.getUTCSeconds(), 2);

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

                    $("#tflowrate").show();
                    $("#tamount").hide();
                    $("#ttime").hide();
 
                    break;
                case 1:
                    $('#runmode').text('Dispense Mode (volume)');

                    $("#tflowrate").hide();
                    $("#tamount").show();
                    $("#ttime").show();
                    break;
                case 2:
                    $('#runmode').text('Dispense Mode (flow rate)');

                    $("#tflowrate").show();
                    $("#tamount").hide();
                    $("#ttime").show();
                    break;
                
            }

            if (!$('#amount_input').hasClass("dontupdate")) {
                $('#amount_input').val(data.model.amount);
            }

            if (!$('#flowrate_input').hasClass("dontupdate")) {
                $('#flowrate_input').val(data.model.flowrate);
            }

            var d2 = new Date(data.model.time);

            if (!$('#time_input').hasClass("dontupdate")) {
                $('#time_input').val(d2.getUTCSeconds() + d2.getUTCMinutes()*60 + d2.getUTCHours() * 60 * 60);
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

    exports.setTimeSeconds = function setTimeSeconds(data) {

        var d = new Date();

        d.setTime(data*1000);

        localeventbus.emit("ui.command", {
            "command": "set_time",
            "value": d.getTime()
        });

    };

})(typeof exports == 'undefined' ? this['ui'] = {} : exports);