

var localeventbus;

exports.init = function (eventbus) {
    localeventbus = eventbus;
    

    localeventbus.on ("serialport_opened", function() {
        
        console.log ("serial port opened");
    });

    localeventbus.on ("connecting", function(url) {
        
        console.log ("connecting to " + url);
    });

    localeventbus.on ("connected", function(url) {
        
        console.log ("connected to  " + url);
    });

    localeventbus.on ("subscribing", function(channelname) {
        
        console.log ("subscribing to " + channelname);
    });

    localeventbus.on ("connectionclosed", function() {
        
        console.log ("connection closed");
    });

    localeventbus.on ("channelsubscription", function(channelname, channel) {
        
        console.log ("subscribed to "+channelname);
    });

    localeventbus.on ("device_log", function(lm, data) {
        
        console.log (JSON.stringify(data));
    });
    
    

    localeventbus.emit ("consolelogger.initialized");
};