(function (exports) {

    var localeventbus;
    var data;

    exports.init = function (eventbus) {

        localeventbus = eventbus;

        if (typeof String.prototype.startsWith != 'function') {
            String.prototype.startsWith = function (str) {
                return this.indexOf(str) == 0;
            };
        }


        eventbus.on("ui.update", function (data) {

            switch (parseInt(data.model.usrled0)) {
                case 0:
                    $('#usrled0button').removeClass('active');
                    break;
                case 1:
                    $('#usrled0button').addClass('active');
                    break;
            }

            switch (parseInt(data.model.usrled1)) {
                case 0:
                    $('#usrled1button').removeClass('active');
                    break;
                case 1:
                    $('#usrled1button').addClass('active');
                    break;
            }

            switch (parseInt(data.model.usrled2)) {
                case 0:
                    $('#usrled2button').removeClass('active');
                    break;
                case 1:
                    $('#usrled2button').addClass('active');
                    break;
            }

            switch (parseInt(data.model.usrled3)) {
                case 0:
                    $('#usrled3button').removeClass('active');
                    break;
                case 1:
                    $('#usrled3button').addClass('active');
                    break;
            }

            if (data.model.lastserialmessage != "") {

                $('#serialconsole').val($('#serialconsole').val() + data.model.lastserialmessage + "\n");

            }

            if (data.model.serialstatus == true) {

                document.getElementById('serialconnect').style.display = "none";
                document.getElementById('serialdisconnect').style.display = "";

                document.getElementById("serialstatus").innerHTML = "(connected to "+data.model.serialport + " - "+data.model.serialbaud+" baud)";

            } else {

                document.getElementById('serialconnect').style.display = "";
                document.getElementById('serialdisconnect').style.display = "none";

                document.getElementById("serialstatus").innerHTML = "(closed)";
            }


        });

    };

    exports.serialopen = function serialopen() {
        localeventbus.emit("ui.command", {
            "command": "serialopen"
        });
    };

    exports.serialclose = function serialclose() {
        localeventbus.emit("ui.command", {
            "command": "serialclose"
        });
    };

    exports.serialsetbaud = function serialsetbaud() {
        localeventbus.emit("ui.command", {
            "command": "serialsetbaud",
            "value": $('#serialbaud').val()
        });
    };

    exports.serialsetport = function serialsetport() {
        localeventbus.emit("ui.command", {
            "command": "serialsetport",
            "value": $('#serialport').val()
        });
    };

    exports.sendserial = function sendserial() {

        var data = "";

        data = $('#sendserial').val();

        localeventbus.emit("ui.command", {
            "command": "sendserial",
            "value": data
        });

    };

    exports.toggleusrled0 = function toggleusrled0() {

        var data = "";

        if ($('#usrled0button').hasClass('active')) {
            data = "0";
        } else {
            data = "1";
        }

        localeventbus.emit("ui.command", {
            "command": "setled",
            "led": "USR0",
            "value": data
        });

    };

    exports.toggleusrled1 = function toggleusrled1() {

        var data = "";

        if ($('#usrled1button').hasClass('active')) {
            data = "0";
        } else {
            data = "1";
        }

        localeventbus.emit("ui.command", {
            "command": "setled",
            "led": "USR1",
            "value": data
        });
    };

    exports.toggleusrled2 = function toggleusrled2() {

        var data = "";

        if ($('#usrled2button').hasClass('active')) {
            data = "0";
        } else {
            data = "1";
        }

        localeventbus.emit("ui.command", {
            "command": "setled",
            "led": "USR2",
            "value": data
        });
    };

    exports.toggleusrled3 = function toggleusrled3() {

        var data = "";

        if ($('#usrled3button').hasClass('active')) {
            data = "0";
        } else {
            data = "1";
        }

        localeventbus.emit("ui.command", {
            "command": "setled",
            "led": "USR3",
            "value": data
        });
    };



})(typeof exports == 'undefined' ? this['ui'] = {} : exports);