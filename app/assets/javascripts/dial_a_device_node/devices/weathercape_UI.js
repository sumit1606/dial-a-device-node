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

            document.getElementById("temperature").innerHTML = data.model.temperature;

            document.getElementById("pressure").innerHTML = data.model.pressure;

            document.getElementById("humidity").innerHTML = data.model.humidity;

            document.getElementById("lux").innerHTML = data.model.lux;


        });

    };




})(typeof exports == 'undefined' ? this['ui'] = {} : exports);