(function (exports) {

    var device_model_simulation = {

        runmode: '0',
        pressure: '1013',
        setpoint: '300',
        power: '10',
        ventilation: '0',
        coolant: '0',
        runtime: '0.0',
        pressureunit: '0',
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
        pumpengine: false

    };

    exports.init = function (eventbus) {

        setInterval(function () {

            eventbus.emit('ui.update', {
                    "component": "all",
                    "model": device_model_simulation
                });

            eventbus.emit('device.snapshot', device_model_simulation);


        }, 1000);

        eventbus.emit("serial.simulation");
        eventbus.emit("serial.portopened");

        setInterval(function () {

            // simulation tick

            if (device_model_simulation.pumpengine) {

                var rt = parseFloat(device_model_simulation.runtime) + 0.5;
                device_model_simulation.runtime = rt;



            } else {

            }

            if (device_model_simulation.ventilation == 0) {

                if ((device_model_simulation.runmode == 0) && (device_model_simulation.pumpengine)) {
                    // Evacuation
                    var oldpressure = parseInt(device_model_simulation.pressure);
                    var newpressure = oldpressure - 20;
                    if (newpressure <= 0) {
                        newpressure = 0;
                    }
                    device_model_simulation.pressure = newpressure.toString();
                }

                if ((device_model_simulation.runmode == 1) && (device_model_simulation.pumpengine)) {
                    // Pressure control
                    var oldpressure = parseInt(device_model_simulation.pressure);

                    var newpressure = oldpressure;

                    if (oldpressure < device_model_simulation.setpoint) {
                        newpressure = oldpressure + 20;
                    }

                    if (oldpressure > device_model_simulation.setpoint) {
                        newpressure = oldpressure - 20;
                    }

                    if (Math.abs(oldpressure - newpressure) < 20) {
                        newpressure = device_model_simulation.setpoint;
                    }

                    device_model_simulation.pressure = newpressure.toString();
                }

            } else {
                // Increase pressure, because ventilation is open
                var oldpressure = parseInt(device_model_simulation.pressure);
                var newpressure = oldpressure + 300;
                if (newpressure > 1013) {
                    newpressure = 1013;
                }
                device_model_simulation.pressure = newpressure.toString();
            }

        }, 500);

        eventbus.emit("serial.simulation");
        eventbus.emit("serial.portopened");


        if (typeof String.prototype.startsWith != 'function') {
            String.prototype.startsWith = function (str) {
                return this.indexOf(str) == 0;
            };
        }

        eventbus.on("serial.command", function (message) {

            var value = "1";

            // get

            if (message.startsWith('pP')) {
                value = device_model_simulation.runtime + ";" + device_model_simulation.pressure + ";" + device_model_simulation.setpoint + ";" + device_model_simulation.power + ";" + "  50";
            }

            if (message.startsWith('gM')) {
                value = device_model_simulation.runmode + ";" + "  1";
            }

            if (message.startsWith('gUp')) {
                value = device_model_simulation.pressureunit + ";" + "  1";
            }

            if (message.startsWith('gV')) {
                value = device_model_simulation.ventilation + ";" + "  1";
            }

            if (message.startsWith('gW')) {
                value = device_model_simulation.coolant + ";" + "  1";
            }

            if (message.startsWith('gFv')) {
                value = "1";
                value = message.substr(3);
                splitter = value.split(';');
                index_chk = parseInt(splitter[0].trim());
                value = index_chk + ";" + device_model_simulation.jashon[index_chk].jso_time + ";" + device_model_simulation.jashon[index_chk].jso_pressure + " ; " + device_model_simulation.jashon[index_chk].jso_coolant + ";1";
            }
            // set

            if (message.startsWith('cM')) {
                d = message.substr(2);

                switch (d) {

                    case 'n':
                        d = "0";

                        break;
                    case 'r':
                        d = "1";
                        break;
                    case 'a':
                        d = "2";
                        break;
                    case 'f':
                        d = "3";
                        break;
                }

                device_model_simulation.runmode = d;

            }

            if (message.startsWith('cUp')) {
                d = message.substr(3);
                device_model_simulation.pressureunit = d;
            }

            if (message.startsWith('dV')) {
                d = message.substr(2);
                device_model_simulation.ventilation = d;
            }

            if (message.startsWith('dW')) {
                d = message.substr(2);
                device_model_simulation.coolant = d;
            }

            if (message.startsWith('dB')) {
                device_model_simulation.pumpengine = true;
            }

            if (message.startsWith('dE')) {
                device_model_simulation.pumpengine = false;
                device_model_simulation.runtime = "0.0";
            }

            if (message.startsWith('cS')) {

                d = message.substr(2);
                device_model_simulation.power = d;
            }

            if (message.startsWith('cC')) {

                d = message.substr(2);

                device_model_simulation.setpoint = d;
            }

            if (message.startsWith('cFs')) {


                d = message.substr(3);
                splitter = d.split(';');
                index_chk = parseInt(splitter[0].trim());

                device_model_simulation.jashon[index_chk].jso_time = splitter[1].trim();
                device_model_simulation.jashon[index_chk].jso_pressure = splitter[2].trim();
                device_model_simulation.jashon[index_chk].jso_coolant = splitter[3].trim();


            }


            if (message.startsWith('cFd')) {

                d = message.substr(3);
                splitter = d.split(';');
                index_chk = parseInt(splitter[0].trim());
                for (i = index_chk; i < 11; i++) {
                    device_model_simulation.jashon[i].jso_time = device_model_simulation.jashon[i + 1].jso_time;
                    device_model_simulation.jashon[i].jso_pressure = device_model_simulation.jashon[i + 1].jso_pressure;
                    device_model_simulation.jashon[i].jso_coolant = device_model_simulation.jashon[i + 1].jso_coolant;

                }
                device_model_simulation.jashon[11].jso_time = "";
                device_model_simulation.jashon[11].jso_pressure = "";
                device_model_simulation.jashon[11].jso_coolant = "";
            }

            if (message.startsWith('cFc')) {

                d = message.substr(3);
                splitter = d.split(';');
                index_chk = parseInt(splitter[0].trim());
                for (i = index_chk; i < 12; i++) {
                    device_model_simulation.jashon[i].jso_time = "";
                    device_model_simulation.jashon[i].jso_pressure = "";
                    device_model_simulation.jashon[i].jso_coolant = "";
                }
            }

            eventbus.emit("device.reply", message, value);
        });


    };

})(typeof exports == 'undefined' ? this['simulator'] = {} : exports);