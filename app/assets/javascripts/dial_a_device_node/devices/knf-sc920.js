(function (exports) {

    var device_model = {

        runmode: 'n',
        pressure: '0',
        setpoint: '0',
        power: '0',
        ventilation: '0',
        coolant: '0',
        runtime: '0',

        jashon: [{
            "jso_time": "52",
            "jso_pressure": "20",
            "jso_coolant": "2"
        }, {
            "jso_time": "34",
            "jso_pressure": "54",
            "jso_coolant": "1"
        }, {
            "jso_time": "68",
            "jso_pressure": "44",
            "jso_coolant": "2"
        }, {
            "jso_time": "69",
            "jso_pressure": "89",
            "jso_coolant": "2"
        }, {
            "jso_time": "15",
            "jso_pressure": "89",
            "jso_coolant": "1"
        }, {
            "jso_time": "78",
            "jso_pressure": "55",
            "jso_coolant": "2"
        }, {
            "jso_time": "98",
            "jso_pressure": "21",
            "jso_coolant": "2"
        }, {
            "jso_time": "96",
            "jso_pressure": "85",
            "jso_coolant": "1"
        }, {
            "jso_time": "75",
            "jso_pressure": "18",
            "jso_coolant": "2"
        }, {
            "jso_time": "87",
            "jso_pressure": "10",
            "jso_coolant": "1"
        }, {
            "jso_time": "98",
            "jso_pressure": "25",
            "jso_coolant": "2"
        }, {
            "jso_time": "32",
            "jso_pressure": "19",
            "jso_coolant": "1"
        }],

        pressureunit: '0'
    };


    var datacurve = new Array();

    exports.init = function (eventbus) {

        if (typeof String.prototype.startsWith != 'function') {
            String.prototype.startsWith = function (str) {
                return this.indexOf(str) == 0;
            };
        }

        eventbus.on("device.initialized", function () {

        });


        eventbus.on("device.snapshot", function (param) {

            if (device_model.runtime == "0.0") {
                if (datacurve.length > 10) {
                    datacurve.shift();
                }
            }

            var tm = (new Date()).getTime();
            var pr = parseInt(param.pressure);

            var datapoint = [tm, pr];
            datacurve.push(datapoint);

            eventbus.emit("ui.refreshdatacurve", datacurve);

        });

        eventbus.on("device.heartbeat", function () {

            eventbus.emit("serial.command", "pP");
            eventbus.emit("serial.command", "gM");
            eventbus.emit("serial.command", "gUp");
            eventbus.emit("serial.command", "gV");
            eventbus.emit("serial.command", "gW");

        });




        eventbus.on("device.command", function (data) {

            if (data.command == "setrunmode") {

                eventbus.emit("serial.command", "cM" + data.value)
            }

            if (data.command == "setstartstop") {

                eventbus.emit("serial.command", "d" + data.value)
            }

            if (data.command == "setpressureunit") {

                eventbus.emit("serial.command", "cUP" + data.value)
            }

            if (data.command == "setventilation") {

                eventbus.emit("serial.command", "dV" + data.value)
            }

            if (data.command == "setcoolant") {

                eventbus.emit("serial.command", "dW" + data.value)
            }

            if (data.command == "setpower") {

                eventbus.emit("serial.command", "cS" + data.value)
            }

            if (data.command == "setsetpoint") {

                eventbus.emit("serial.command", "cC" + data.value)
            }

        });


    };



})(typeof exports == 'undefined' ? this['device'] = {} : exports);