(function(exports) {

    exports.init = function (eventbus) {
 
        eventbus.on ("ui.update.rotation", function(device_model) {
            g1.refresh(device_model.rotation);
        });

        eventbus.on ("ui.update.temperature", function(device_model) {
            g2.refresh(device_model.temperature);
        });

        eventbus.on ("ui.update.exttemperature", function(device_model) {
            g3.refresh(device_model.exttemperature);
        });

        eventbus.on ("ui.update.vacuum", function(device_model) {
            g4.refresh(device_model.vacuum);
        });

    };

})(typeof exports == 'undefined'? this['ui'] = {}: exports);