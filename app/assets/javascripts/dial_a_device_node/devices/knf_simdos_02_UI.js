(function (exports) {

    exports.init = function (eventbus) {

        eventbus.on("ui.update", function (data) {

            g1.refresh(data.model.amount * 1000);

        });

    };

})(typeof exports == 'undefined' ? this['ui'] = {} : exports);