(function (exports) {

    var websockets;

    var localeventbus;

    var channel;

    var deviceendpoint = false;

    var simulation = false;

    var device_info = {

        deviceid: "",
        operationid: "",
        devicetype: ""

    }

    var channelname = "";
    var url = "";


    exports.websockets = websockets;

    exports.halt = function () {

        if (!(typeof websockets === "undefined")) {
            websockets.close();
        }

    }

    exports.init = function (eventbus, de) {
        localeventbus = eventbus;

        deviceendpoint = de;



        localeventbus.emit("initialized");

        localeventbus.emit("status.deviceendpoint", deviceendpoint);

        localeventbus.on("serial.simulation", function () {

            simulation = true;

        });

        localeventbus.on("device.announce.deviceid", function (data) {
            device_info.deviceid = data;
        });

        localeventbus.on("device.announce.operationid", function (data) {
            device_info.operationid = data;
        });

        localeventbus.on("device.announce.devicetype", function (data) {
            device_info.devicetype = data;
        });

        localeventbus.on("webconnection.set.channelname", function (data) {
            channelname = data;
        });

        localeventbus.on("webconnection.set.url", function (data) {
            url = data;
        });

        localeventbus.on("webconnection.set.deviceendpoint", function (data) {
            (typeof data == 'object' ? deviceendpoint = data[0] : deviceendpoint = data);
        });

        localeventbus.on("webconnection.connect", function (data) {

            localeventbus.emit('connecting', url);

            websockets = new WebSocketRails(url, true);

            websockets.bind("connection_closed", function (data) {
                localeventbus.emit('webconnection.closed');
            });

            websockets.bind("connection_error", function (data) {
                localeventbus.emit('webconnection.closed');
            });


            localeventbus.on("device.snapshot", function (model) {

                websockets.trigger("device.log", {

                        "device_info": device_info,
                        "model": model
                    
                });
            });

            websockets.on_open = function (data) {
                localeventbus.emit('webconnection.connected', url);

                localeventbus.emit('channel.subscribing', channelname);

                channel = websockets.subscribe(channelname);

                if (simulation) {

                    // create a local loop for ui updates

                    localeventbus.on("ui.command", function (data) {

                        localeventbus.emit("device.command", data);

                    });

                }


                if (deviceendpoint) {

                    localeventbus.on("ui.status", function (data) {
                        channel.trigger("device.status", data);
                    });

                    // device-local loop

                    localeventbus.on("device.requestheartbeat", function (data) {
                        localeventbus.emit("device.heartbeat");
                    });


                    // new commands

                    localeventbus.on("ui.update", function (data) {
                        channel.trigger("ui.update", data);
                    });

                    channel.bind('subscriber_join', function (data) {
                        localeventbus.emit("channel.ui_connected", data);
                    });

                    channel.bind('subscriber_part', function (data) {
                        localeventbus.emit("channel.ui_disconnected", data);
                    });

                    channel.bind('device.command', function (data) {
                        localeventbus.emit("device.command", data);
                    });


                } else {

                    channel.bind("device.status", function (data) {
                        localeventbus.emit("status.incoming", data);
                    });

                    // new commands

                    channel.bind("ui.update", function (data) {
                        localeventbus.emit("ui.update", data);
                    });

                    channel.bind("ui.status", function (data) {
                        localeventbus.emit("status.incoming", data);
                    });

                    localeventbus.on("ui.command", function (data) {
                        channel.trigger("device.command", data);
                    });

                    channel.bind('subscriber_join', function (data) {
                        localeventbus.emit("channel.dev_connected", data);
                    });

                    channel.bind('subscriber_part', function (data) {
                        localeventbus.emit("channel.dev_disconnected", data);
                    });

                }

                localeventbus.emit('channel.subscription', channelname, channel);
            }

        });

    };

    exports.webconnect = function (url) {


    };



})(typeof exports == 'undefined' ? this['webconnection'] = {} : exports);