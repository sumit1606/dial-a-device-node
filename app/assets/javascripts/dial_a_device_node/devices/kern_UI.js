(function(exports) {

    var localeventbus;
    var data;

    exports.init = function (eventbus) {
 
        localeventbus = eventbus;


        eventbus.on ("ui.update.display1", function(device_model) {   
           document.getElementById ("iDisplay").innerHTML = device_model.weight;
        });
        

        eventbus.on ("ui.update.autoprint", function (device_model) {

            switch (parseInt(device_model.autoprint)) {
                   case 0:$('#autoprinticon').removeClass('icon-stop');
                    $('#autoprinticon').addClass('icon-play');
                     alert("hola");
                   $('#autoprintbutton').removeClass('active');
                      alert("hola1");
                      
                     break;
                    case 1: 
                 $('#autoprinticon').removeClass('icon-play');
                    $('#autoprinticon').addClass('icon-stop');
                     alert("merci");
                   $('#autoprintbutton').addClass('active');
                     alert("merci1");
                   break;
                }
        });


        eventbus.on ("ui.update.power", function (device_model) {

            console.log ("switched " + device_model.powmeter);

            switch (parseInt(device_model.powmeter)) {

                   case 0:$('#powericon').removeClass('icon-stop');
                   alert("hey");
                    $('#powericon').addClass('icon-play');

                    $('#powerbutton').removeClass('active');
                      alert("hey2");
                      break;
                    case 1: 
                 $('#powericon').removeClass('icon-play');
                    $('#powericon').addClass('icon-stop');
                    alert("ho");
                    $('#powerbutton').addClass('active');
                   
                  
                   break;
                }
        });



    };
    
   exports.calibration = function calibration(){
        localeventbus.emit ("device.set.calibration")
    };

    

    exports.energy = function energy() {

        var data = "";

        if ($('#powerbutton').hasClass('active')) {
            data= "0";
        } else {
            data = "1";
        }

        localeventbus.emit ("device.set.energy", [data]);
    };
    
       exports.tare = function tare(){
        localeventbus.emit ("device.set.tare")
    };


       exports.print = function print(){
        localeventbus.emit ("device.set.print")
    };
    
    exports.reset = function reset(){
        localeventbus.emit ("device.set.reset")
    };

    exports.toggleautoprint = function toggleautoprint() {
        var data = "0";
        if ($('#autoprintbutton').hasClass('active')) {
            data = "0";
        } else {
            data = "1";
        }
        alert("data OF AUTOPRINT ABOUT TO BE SEND");
        console.log(data);

        localeventbus.emit ("device.set.autoprint", [data]);
    };
  

})(typeof exports == 'undefined'? this['ui'] = {}: exports);