(function (exports) {

    exports.init = function (eventbus) {

        eventbus.on("ui.update", function (data) {

            hg1.refresh(data.model.rotation);
            hg2.refresh(data.model.temperature);
            hg3.refresh(data.model.exttemperature);
            hg4.refresh(data.model.vacuum);


        });

    };

})(typeof exports == 'undefined' ? this['ui'] = {} : exports);