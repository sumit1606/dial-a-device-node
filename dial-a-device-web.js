var myhttp = require('http');
var querystring = require('querystring');

(function (exports) {

    exports.getBBInfo = function (host, myip, myserial, callback, callback_error) {

        if (host.indexOf(":") > -1) {

            var hn = host.substr(0, host.indexOf(":"));

            var port = host.substr(host.indexOf(":") + 1);

        } else {

            var hn = host;
            var port = 80;
        }

        var postdata = querystring.stringify({

            "beaglebone[ipaddress]": myip,

                "beaglebone[serialnumber]": myserial,

            commit: "Update Beaglebone"

        });

        var options = {
            hostname: hn,
            port: port,
            path: "/connect/" + myserial,
            method: "POST",
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            }
        }


        var request = myhttp.request(options, function (res) {

            var body = "";

            res.setEncoding("utf8");

            res.on('data', function (chunk) {
                body += chunk;
            });

            res.on('end', function () {
                var myResponse = JSON.parse(body);

                if (myResponse) {

                    if (typeof myResponse.table === "undefined") {

                        callback(myResponse);

                    } else {

                        callback(myResponse.table);

                    }
                } else {
                    callback({});
                }
            });


        }).on('error', function (e) {

            callback_error(e.message);

        });

        request.write(postdata);
        request.end();

    }



})(typeof exports == 'undefined' ? this['dialadeviceweb'] = {} : exports);