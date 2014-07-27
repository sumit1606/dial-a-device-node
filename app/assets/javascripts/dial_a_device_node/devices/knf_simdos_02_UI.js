(function (exports) {

    exports.init = function (eventbus) {

        eventbus.on("ui.update", function (data) {


            document.getElementById("amountcounter").innerHTML = data.model.amountcounter + " ul";

            var d = new Date(data.model.timecounter);

            document.getElementById("timecounter").innerHTML = d.getHours()+':'+d.getMinutes()+':'+d.getSeconds()+'.'+getMilliseconds();

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
                    $('#runmode').text('Dispense Mode ml');

                    $("#tflowrate").hide();
                    $("#tamount").show();
                    $("#ttime").show();
                    break;
                case 2:
                    $('#runmode').text('Dispense Mode ml/min');

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