(function (exports) {


    var fwroot;

    var watcher;


    exports.init = function (eventbus) {
        localeventbus = eventbus;

        localeventbus.on("folderwatcher.set_root", function (data) {

            fwroot = data;

        });



        localeventbus.on("folderwatcher.start", function (data) {

            var fs = require('fs'); 

            fs.exists(fwroot, function(exists) { 
              if (exists) { 

                require('chokidar').watch(fwroot, {ignored: /[\/\\]\./, persistent: true}).on('all', function(event, path) {

                    localeventbus.emit("folderwatcher.event", event, path);

                });
                
              } 
            }); 

            

        });

        
    };

})(typeof exports == 'undefined' ? this['folderwatcher'] = {} : exports);