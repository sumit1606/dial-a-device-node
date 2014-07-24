(function (exports) {

    var device_model = {

        d: 0

    };

    var device_id;

    var fs = require('fs');

    exports.init = function (eventbus) {

        if (typeof String.prototype.startsWith != 'function') {
            String.prototype.startsWith = function (str) {
                return this.indexOf(str) == 0;
            };
        }

        eventbus.on("device.announce.deviceid", function(data){

            device_id = data;
        });

        eventbus.on("device.folderwatcher_initialized", function () {


            eventbus.emit('device.assumeconnected');


            // load all datasets

            eventbus.emit("folderwatcher.start");

        });

        function matchfile(path) {

            // detect measurement locally

            // load from server if not cached

            // if measurement does not contain this file, upload it

            console.log(path);

            console.log(device_id);

        }


        eventbus.on("folderwatcher.event", function(event, path){

            if (event == "add") {

                fs.stat(path, function(err, stats) {

                    if ((Date.now() - stats.mtime) < 1000* 60* 60 * 24) {
                        
                        matchfile(path);

                    }


                });

            }

        });


        eventbus.emit("device.initialized");

    };


})(typeof exports == 'undefined' ? this['device'] = {} : exports);