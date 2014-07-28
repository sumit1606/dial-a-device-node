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

            if (data.model.power == 1) {

                document.getElementById("iDisplay").innerHTML = data.model.weight;
            } else {

                document.getElementById("iDisplay").innerHTML = "---";
            }


            switch (data.model.power) {

                case 0:
                    $('#powerbutton').removeClass('active');
                    break;
                case 1:
                    $('#powerbutton').addClass('active');
                    break;
            }

        });

    };

    // code for changing the power status either on/off
    exports.togglepower = function togglepower() {

        localeventbus.emit("ui.command", {
            "command": "power"
        });

    };

    // code for changing to the tare button i.e tare function is called
    exports.tare = function tare() {
        localeventbus.emit("ui.command", {
            "command": "tare"
        });

    };

    //   code for changing to the print function i.e print function is called
    exports.print = function print() {

        localeventbus.emit("ui.command", {
            "command": "print"
        });
    };



})(typeof exports == 'undefined' ? this['ui'] = {} : exports);