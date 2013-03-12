

var localeventbus;

exports.init = function (eventbus) {
    localeventbus = eventbus;
    localeventbus.emit ("device_initialized");
};

exports.serialdata = function (lm, data) {
    localeventbus.emit('device_received', lm, data);		
  };
  
