(function (exports) {

    var status_model = {

        deviceconnection: false,
        devicesimulation: false,
        devicewebconnection: false,
        webconnection: false,
        webchannel: ""

    }

    var deviceendpoint = false;

    exports.init = function (eventbus) {
        localeventbus = eventbus;

        localeventbus.on("status.deviceendpoint", function (data) {

            deviceendpoint = data;

        });


        localeventbus.on("status.incoming", function (data) {

            status_model_device = data;

            status_model.devicewebconnection = status_model_device.devicewebconnection;
            status_model.deviceconnection = status_model_device.deviceconnection;
            status_model.devicesimulation = status_model_device.devicesimulation;

            localeventbus.emit("ui.status", status_model);
        });

        localeventbus.on("serial.portopened", function () {

            status_model.deviceconnection = true;
            localeventbus.emit("ui.status", status_model);
        });

        localeventbus.on("device.assumeconnected", function () {

            status_model.deviceconnection = true;
            localeventbus.emit("ui.status", status_model);
        });

        localeventbus.on("serial.simulation", function () {

            status_model.devicesimulation = true;

            localeventbus.emit("ui.status", status_model);
        });

        localeventbus.on("serial.openfailed", function () {

            status_model.deviceconnection = false;
            localeventbus.emit("ui.status", status_model);

            setTimeout(function () {
                localeventbus.emit("serial.connect");
            }, 1000);

        });


        localeventbus.on("webconnection.connected", function (url) {

            if (deviceendpoint) {
                status_model.devicewebconnection = true;
            } else {
                status_model.webconnection = true;
            }
            status_model.webchannel = "";
            localeventbus.emit("ui.status", status_model);

        });

        localeventbus.on("webconnection.closed", function () {

            if (deviceendpoint) {
                status_model.devicewebconnection = false;
            } else {
                status_model.webconnection = false;
            }
            status_model.webchannel = "";
            localeventbus.emit("ui.status", status_model);

            setTimeout(function () {
                localeventbus.emit("webconnection.connect");
            }, 1000);
        });

        localeventbus.on("channel.subscription", function (channelname, channel) {

            status_model.webchannel = channelname;

            if (deviceendpoint) {
                status_model.devicewebconnection = true;
            } else {
                status_model.webconnection = true;
            }

            localeventbus.emit("ui.status", status_model);
        });

        localeventbus.on("channel.dev_disconnected", function () {

            if (deviceendpoint) {
                status_model.devicewebconnection = false;
                status_model.deviceconnection = false;
            } else {
                status_model.devicewebconnection = false;
                status_model.deviceconnection = false;
            }

            localeventbus.emit("ui.status", status_model);
        });

        localeventbus.emit("status.initialized");
    };

})(typeof exports == 'undefined' ? this['systemstatus'] = {} : exports);