(function(exports) {

    var localeventbus;
    var data;

    exports.init = function (eventbus) {
 
        localeventbus = eventbus;

        if (typeof String.prototype.startsWith != 'function') {
            String.prototype.startsWith = function (str){
                return this.indexOf(str) == 0;
            };
        }


        eventbus.on ("ui.update.display", function(device_model) {   
           document.getElementById ("iDisplay").innerHTML = device_model.weight;
        });
        
//autoprint state is changing to active or not
        eventbus.on ("ui.update.autoprint", function (device_model) {

            switch (parseInt(device_model.autoprint)) {
                   case 0:$('#autoprinticon').removeClass('icon-stop');
                    $('#autoprinticon').addClass('icon-play');
                   $('#autoprintbutton').removeClass('active');
                       break;
                    case 1: 
                 $('#autoprinticon').removeClass('icon-play');
                    $('#autoprinticon').addClass('icon-stop');
                     $('#autoprintbutton').addClass('active');
                     break;
                }
        });

// powerbutton state is changing to active or not 
        eventbus.on ("ui.update.power", function (device_model) {

            console.log ("switched " + device_model.power);

            switch (parseInt(device_model.power)) {

                   case 0:$('#powericon').removeClass('icon-stop');
                           $('#powericon').addClass('icon-play');
                        $('#powerbutton').removeClass('active');
                          break;
                    case 1: 
                 $('#powericon').removeClass('icon-play');
                    $('#powericon').addClass('icon-stop');
                    $('#powerbutton').addClass('active');
                   break;
                }
        });



    };
// code for the calibaration thing i.e the calibration function is called    
   exports.calibration = function calibration(){
        localeventbus.emit ("device.set.calibration")
    };

// code for changing the power status either on/off
    exports.togglepower = function togglepower() {

        var data = "";

        if ($('#powerbutton').hasClass('active')) {
            data= "0";
        } else {
            data = "1";
        }

        localeventbus.emit ("device.set.power", [data]);
    };
  
// code for changing to the tare button i.e tare function is called
       exports.tare = function tare(){
        localeventbus.emit ("device.set.tare");
    };

//   code for changing to the print function i.e print function is called
       exports.print = function print(){
         localeventbus.emit ("device.set.print");
    };
    
//   code for changing to the reset function i.e reset function is called    
    exports.reset = function reset(){
        localeventbus.emit ("device.set.reset");
    };

//   code for changing to the autoprint function i.e autoprint function is called 
   
    exports.toggleautoprint = function toggleautoprint() {
        var data = "0";
        if ($('#autoprintbutton').hasClass('active')) {
            data = "0";
        } else {
            data = "1";
          }
         localeventbus.emit ("device.set.autoprint", [data]);
    };
  

})(typeof exports == 'undefined'? this['ui'] = {}: exports);