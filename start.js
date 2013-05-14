var dialadevicenode = require ('dial-a-device-node');

dialadevicenode.set_ser_string ('/dev/ttyACM0');

dialadevicenode.set_ser_baud (115200);

dialadevicenode.set_device_id (1);

dialadevicenode.set_url_string ('http://www.dial-a-device.com/websocket');

dialadevicenode.set_device_type ('knf-sc920');

dialadevicenode.set_unique_id ('gf638h2g7g86g3');

dialadevicenode.set_simulate (true);

dialadevicenode.run();
