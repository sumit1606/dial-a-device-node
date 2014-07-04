(function (exports) {


    exports.init = function (eventbus) {
        localeventbus = eventbus;

        localeventbus.on("something", function (data) {

            data;

        });

        localeventbus.emit("status.initialized");
    };

})(typeof exports == 'undefined' ? this['folderwatcher'] = {} : exports);