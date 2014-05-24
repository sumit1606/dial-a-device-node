var util = require ('util');
var os = require ('os');

(function(exports) {

	exports.getSerialNumber = function (callback) {

        var b = require('bonescript');

        b.getPlatform(interpretPlatform);

        function interpretPlatform(x) {

            if (x.serialNumber && x.serialNumber != "") {

                callback(x.serialNumber);

            
            } else {

                require('getmac').getMac(function(err,macAddress){

                    if (err)  throw err;
                    serialnumber = macAddress.replace(/\:/g, "");
                    callback(serialnumber);
                });

            }

        }

    }

    exports.getIPAddress = function (callback) {

    	var interfaces = os.networkInterfaces();
    	var addresses = [];
    	for (k in interfaces) {
    		for (k2 in interfaces[k]) {
    			var address = interfaces[k][k2];
    			if (address.family == "IPv4" && !address.internal) {
    				ipaddress = address.address;
    			}
    		}
    	}

    	if (!ipaddress) {
    		ipaddress = "127.0.0.1";
    	}

        callback(ipaddress);

    }
  


})(typeof exports == 'undefined'? this['beaglebonechip'] = {}: exports);