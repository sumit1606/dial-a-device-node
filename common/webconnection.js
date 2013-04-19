

(function(exports) {


var websockets;

var localeventbus;




exports.websockets = websockets;

exports.init = function (eventbus) {
    localeventbus = eventbus;
    (typeof localeventbus.emitEvent == 'undefined'? this['emitEvent'] = {}: emit);

    localeventbus.emit ("initialized", []);
	
};

exports.webconnect = function (url) {
    localeventbus.emit('connecting', [url]);	
    websockets = new WebSocketRails (url);
	websockets.bind ("connection_closed", function (data) {
	
	localeventbus.emit('connectionclosed', []);
	
	});
	
	websockets.bind ("connection_error", function (data) {
	
	localeventbus.emit('connectionclosed', []);
	
	});
	
	
	
    localeventbus.emit('connected', [url]);
  };
  

exports.trigger = function (fn, data) {
    websockets.trigger (fn, data);
  };

  
exports.subscribe = function (channelname) {
    localeventbus.emit('subscribing', [channelname]);
    channel = websockets.subscribe (channelname);
	
	channel.bind ('client_connected', function (data) {
      console.log ('new client: ' + JSON.stringify (data));
	});
	
    localeventbus.emit('channelsubscription', [channelname, channel]);
  };


})(typeof exports == 'undefined'? this['webconnection'] = {}: exports);