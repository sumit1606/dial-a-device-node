(function(exports) {

    exports.init = function (eventbus) {
 
        setInterval (function() {
            eventbus.emit ("serial_rawincoming", ["20;31.4;25.3;976"]);
        }, 1000);
	
    };

})(typeof exports == 'undefined'? this['simulator'] = {}: exports);