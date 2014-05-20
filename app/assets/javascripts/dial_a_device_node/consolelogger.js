(function(exports) {

exports.init = function (eventbus) {
    localeventbus = eventbus;
    

    localeventbus.on ("serialport_opened", function() {
        
        console.log ("serial port opened");
    });

    localeventbus.on ("serial_rawincoming", function(data) {
        
    //    console.log ("serial rawincoming " + data);
    });

    localeventbus.on ("status.deviceendpoint", function(url) {
        
        console.log ("device endpoint?  " + url);
    });


    localeventbus.on ("connecting", function(url) {
        
        console.log ("connecting to " + url);
    });

    localeventbus.on ("webconnection.connected", function(url) {
        
        console.log ("connected to  " + url);
    });

    localeventbus.on ("channel.subscribing", function(channelname) {
        
        console.log ("subscribing to " + channelname);
    });

    localeventbus.on ("connectionclosed", function() {
        
        console.log ("connection closed");
    });

    localeventbus.on ("channel.subscription", function(channelname, channel) {
        
        console.log ("subscribed to "+channelname);
    });



    localeventbus.on ("channel.ui_connected", function(data) {
        
        console.log ("new ui conection: " + JSON.stringify(data));
    });

    localeventbus.on ("channel.ui_disconnected", function(data) {
        
        console.log ("ui disconection: " + JSON.stringify(data));
    });

    localeventbus.on ("channel.dev_connected", function(data) {
        
        console.log ("new dev conection: " + JSON.stringify(data));
    });

    localeventbus.on ("channel.dev_disconnected", function(data) {
        
        console.log ("dev disconection: " + JSON.stringify(data));
    });



    localeventbus.on ("device.log", function(lm, data) {
        
        console.log (JSON.stringify(data));
    });

    localeventbus.on ("device.initialized", function () {

        console.log ("device initialized");

    });

    localeventbus.on ("device.snapshot", function (device_model) {

        console.log ("device snapshot: " + JSON.stringify(device_model));

    });

    localeventbus.on ("device.command", function (message) {

        console.log ("device command: " + JSON.stringify(message));

    });
    
    localeventbus.on ("device.reply", function (message) {

        console.log ("device reply: " + JSON.stringify(message));

    });

    localeventbus.on ("ui.update", function (message) {

        console.log ("ui update: " + JSON.stringify(message));

    });

    localeventbus.on ("ui.command", function (message) {

        console.log ("ui command: " + JSON.stringify(message));

    });

    localeventbus.on ("status.incoming", function (message) {
        
        console.log ("status incoming  " + JSON.stringify(message));
    });


    localeventbus.emit ("consolelogger.initialized", []);
};

})(typeof exports == 'undefined'? this['consolelogger'] = {}: exports);