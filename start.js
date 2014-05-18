var dialadevicenode = require ('./dial_a_device_node.js');

dialadevicenode.set_ser_string ('/dev/ttyUSB0');

dialadevicenode.set_ser_baud (1200);

dialadevicenode.set_device_id (1);

dialadevicenode.set_url_string ('localhost:3000/websocket');

dialadevicenode.set_device_type ('heidolph');

dialadevicenode.set_unique_id ('gf638h2g7g86g3');

dialadevicenode.set_simulate (true);

dialadevicenode.run();
