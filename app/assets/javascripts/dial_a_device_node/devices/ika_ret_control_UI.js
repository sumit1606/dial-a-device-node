(function (exports) {

    exports.init = function (eventbus) {

        eventbus.on("ui.update", function (data) {

            g1.refresh(data.model.temperature);

        });

    };

})(typeof exports == 'undefined' ? this['ui'] = {} : exports);