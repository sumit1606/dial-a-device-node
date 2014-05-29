(function (exports) {

    exports.init = function (eventbus) {

        eventbus.on("ui.update", function (data) {

            g1.refresh(data.model.rotation);
            g2.refresh(data.model.temperature);
            g3.refresh(data.model.exttemperature);
            g4.refresh(data.model.vacuum);


        });

    };

})(typeof exports == 'undefined' ? this['ui'] = {} : exports);