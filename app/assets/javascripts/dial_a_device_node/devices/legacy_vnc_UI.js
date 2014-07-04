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


        });

    };



})(typeof exports == 'undefined' ? this['ui'] = {} : exports);