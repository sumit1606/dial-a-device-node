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

        
        eventbus.on("device.reply", function (lastmessage, data) {

            if (lastmessage.startsWith('pP')) {

                try {

                    var re = ("" + data).split(';');

                    device_model.runtime = re[0].trim();
                    device_model.pressure = re[1].trim();
                    device_model.setpoint = re[2].trim();
                    device_model.power = re[3].trim();

                    eventbus.emit('ui.update', {
                        "component": "all",
                        "model": device_model
                    });

                    eventbus.emit('device.snapshot', device_model);

                } catch (e) {

                }
            }

            if (lastmessage.startsWith('gM')) {

                try {

                    var re = ("" + data).split(';');

                    device_model.runmode = re[0].trim();

                    eventbus.emit('ui.update', {
                        "component": "all",
                        "model": device_model
                    });

                    eventbus.emit('device.snapshot', device_model);

                } catch (e) {

                }
            }

            if (lastmessage.startsWith('gUp')) {

                try {

                    var re = ("" + data).split(';');

                    device_model.pressureunit = re[0].trim();

                    eventbus.emit('ui.update', {
                        "component": "all",
                        "model": device_model
                    });

                    eventbus.emit('device.snapshot', device_model);

                } catch (e) {

                }
            }

            if (lastmessage.startsWith('gV')) {

                try {

                    var re = ("" + data).split(';');

                    device_model.ventilation = re[0].trim();

                    eventbus.emit('ui.update', {
                        "component": "all",
                        "model": device_model
                    });

                    eventbus.emit('device.snapshot', device_model);

                } catch (e) {

                }
            }

            if (lastmessage.startsWith('gW')) {

                try {

                    var re = ("" + data).split(';');

                    device_model.coolant = re[0].trim();

                    eventbus.emit('ui.update', {
                        "component": "all",
                        "model": device_model
                    });

                    eventbus.emit('device.snapshot', device_model);

                } catch (e) {

                }
            }

            if (lastmessage.startsWith('gFv')) {

                var re = ("" + data).split(';');

                if (re.length > 4) {

                    var x = re[0].trim();
                    device_model.jashon[x].jso_time = re[1].trim();
                    device_model.jashon[x].jso_pressure = re[2].trim();
                    device_model.jashon[x].jso_coolant = re[3].trim();

                    eventbus.emit('ui.update', {
                        "component": "all",
                        "model": device_model
                    });

                    eventbus.emit('device.snapshot', device_model);

                } else {
                    console.log('wrong reply gFv');
                    console.log(lastmessage);
                    console.log(data);

                }


            }

            if (lastmessage.startsWith('cFd') || lastmessage.startsWith('cFc') || lastmessage.startsWith('cFs')) {

                eventbus.emit('device.update.list', device_model);
            }

        });


        eventbus.on("device.update.list", function (device_model) {


            for (index = 0; index < 12; index++) {

                localeventbus.emit("device.update.row", index);
            }
        });

        eventbus.on("device.update.row", function (data) {

            eventbus.emit("serial.command", "gFv" + data)
        });

        eventbus.on("device.set.function", function (temp_obj, o1, o2, o3) {

            var main_i = parseInt(temp_obj);
            var main_t = o1;
            var main_p = o2;
            var main_c = o3;
            eventbus.emit("serial.command", "cFs " + main_i + ";" + main_t + ";" + main_p + ";" + main_c + ";");


        });

        eventbus.on("device.delAll.function", function (temp_obj_2) {

            eventbus.emit("serial.command", "cFd " + temp_obj_2 + ";");

        });

        eventbus.on("device.del1.function", function (temp_obj_3) {

            eventbus.emit("serial.command", "cFc " + temp_obj_3 + ";");

        });


        eventbus.emit("device.initialized");        


    };



})(typeof exports == 'undefined' ? this['device'] = {} : exports);