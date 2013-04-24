(function(exports) {

    exports.init = function (eventbus) {
 
        eventbus.on ("ui.update.rotation", function(device_model) {
            document.getElementById ("rotation").innerHTML = device_model.rotation;
        });

        eventbus.on ("ui.update.rotation", function(device_model) {
            document.getElementById ("temperature").innerHTML = device_model.temperature;
        });

        eventbus.on ("ui.update.rotation", function(device_model) {
            document.getElementById ("exttemperature").innerHTML = device_model.exttemperature;
        });

        eventbus.on ("ui.update.rotation", function(device_model) {
            document.getElementById ("vacuum").innerHTML = device_model.vacuum;
        });

    };


})(typeof exports == 'undefined'? this['ui'] = {}: exports);