(function(exports) {

	var websockets;

	var localeventbus;

	var channel;

	var deviceendpoint = false;

	var device_info = {

		deviceid: "", 
		operationid: "",
		devicetype: ""

	}

	var channelname = "";
	var url = "";


	exports.websockets = websockets;

	exports.init = function (eventbus, de) {
    	localeventbus = eventbus;

    	deviceendpoint = de;



    	localeventbus.emit ("initialized", []);

    	localeventbus.emit ("status.deviceendpoint", [deviceendpoint]);

    	localeventbus.on ("device.announce.deviceid", function (data) {
    		(typeof data == 'object'? device_info.deviceid = data[0] : device_info.deviceid = data);
    	});

    	localeventbus.on ("device.announce.operationid", function (data) {
    		(typeof data == 'object'? device_info.operationid = data[0] : device_info.operationid = data);
    	});

    	localeventbus.on ("device.announce.devicetype", function (data) {
    		(typeof data == 'object'? device_info.devicetype = data[0] : device_info.devicetype = data);
    	});

    	localeventbus.on ("webconnection.set.channelname", function (data) {
    		(typeof data == 'object'? channelname = data[0] : channelname = data);
    	});

    	localeventbus.on ("webconnection.set.url", function (data) {
    		(typeof data == 'object'? url = data[0] : url = data);
    	});

    	localeventbus.on ("webconnection.set.deviceendpoint", function (data) {
    		(typeof data == 'object'? deviceendpoint = data[0] : deviceendpoint = data);
    	});

    	localeventbus.on ("webconnection.connect", function (data) {
    		localeventbus.emit('connecting', [url]);	

    	websockets = new WebSocketRails (url, false);

		websockets.bind ("connection_closed", function (data) {
			localeventbus.emit('webconnection.closed', []);
		});
	
		websockets.bind ("connection_error", function (data) {
			localeventbus.emit('webconnection.closed', []);
		});


		localeventbus.on ("device.snapshot", function (data) {

			websockets.trigger ("device.log", [{"metainfo": device_info, "data": data}]);
		});


		websockets.on_open = function(data) {
			localeventbus.emit('webconnection.connected', [url]);

			localeventbus.emit('channel.subscribing', [channelname]);

    		channel = websockets.subscribe (channelname);
	
			channel.bind ('client_connected', function (data) {
				// localeventbus.emit ("channel.client_connected", [data]);
			});

			if (deviceendpoint) {

				channel.bind ("device.command", function (data) {
					localeventbus.emit ("device.command", [data]);
				});

				channel.bind ("device.immediatecommand", function (data) {
					localeventbus.emit ("device.immediatecommand", [data]);
				});

				localeventbus.on ("device.reply", function (lm, data) {
					channel.trigger ("device.reply", lm, data);
				});

				localeventbus.on ("ui.update.status", function (data) {
					channel.trigger ("device.status", data);
				});

				localeventbus.on ("device.snapshot", function (data) {
					channel.trigger ("device.updatemodel", data);
				});

			} else {

				channel.bind ("device.reply", function (lm, data) {
					localeventbus.emit ("device.reply", [lm, data]);
				});

				localeventbus.on ("device.command", function (data) {
					channel.trigger ("device.command", data);
				});

				localeventbus.on ("device.immediatecommand", function (data) {
					channel.trigger ("device.immediatecommand", data);
				});

				channel.bind ("device.status", function (data) {
					localeventbus.emit ("status.incoming", [data]);
				});

				channel.bind ("device.updatemodel", function (data) {
					localeventbus.emit ("device.updatemodel", [data]);
				});

			}
	
    		localeventbus.emit('channel.subscription', [channelname, channel]);
		}

    	});
	
	};

	exports.webconnect = function (url) {
    	
	
  	};
  


})(typeof exports == 'undefined'? this['webconnection'] = {}: exports);