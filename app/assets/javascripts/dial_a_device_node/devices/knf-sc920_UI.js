
(function(exports) {

	var localeventbus;

	var temp_device_model;

	exports.init = function (eventbus) {

		localeventbus = eventbus;

    	eventbus.on ("ui.update.runtime", function(device_model) {
    		temp_device_model = device_model;
        	runtime = parseFloat(device_model.runtime);

			if (runtime > 0) {
				$('#startstopicon').removeClass('icon-play');
				$('#startstopicon').addClass('icon-stop');
				$('#startstop').addClass('active');

				$('#runmode').addClass('disabled');
			} else {
				$('#startstopicon').removeClass('icon-stop');
				$('#startstopicon').addClass('icon-play');
				$('#startstop').removeClass('active');

				$('#runmode').removeClass('disabled');
		    }
    	});

    	eventbus.on ("ui.update.pressure", function (device_model) {
    		$('#pressure').text(device_model.pressure);
    	});

    	eventbus.on ("ui.update.power", function (device_model) {
    		$('#textb').val(parseInt(device_model.power));
    	});

    	eventbus.on ("ui.update.setpoint", function (device_model) {
    		$('#textb2').val(parseInt(device_model.setpoint));
    	});

    	eventbus.on ("ui.update.ventilation", function (device_model) {
    		switch (parseInt(device_model.ventilation)) {
					case 0: $('#ventilationicon').removeClass('icon-star-empty');
					$('#ventilationicon').addClass('icon-star');
					$('#ventilationbutton').removeClass('active'); break;

					case 1: $('#ventilationicon').removeClass('icon-star');
					$('#ventilationicon').addClass('icon-star-empty');
					$('#ventilationbutton').addClass('active'); break;
					
				}
    	});

    	eventbus.on ("ui.update.coolant", function (device_model) {
    		temp_device_model = device_model;
    		switch (parseInt(device_model.coolant)) {
					case 0: $('#coolanticon').removeClass('icon-star-empty');
					$('#coolanticon').addClass('icon-star');
					$('#coolantbutton').removeClass('active'); break;

					case 1: $('#coolanticon').removeClass('icon-star');
					$('#coolanticon').addClass('icon-star-empty');
					$('#coolantbutton').addClass('active'); break;
				}
    	});
				

    	eventbus.on ("ui.update.runmode", function (device_model) {
    		temp_device_model = device_model;
			switch ((device_model.runmode)) {
				case '0': $('#runmode').text('Evacuate'); $("#tab2").show(); $("#tab3").hide(); $("#tab4").hide(); $("#container").show(); $('#myModal').modal('hide'); ui.updateChart(); break;
				case '1': $('#runmode').text('Pressure Control'); $("#tab2").hide(); $("#tab3").show(); $("#tab4").hide(); $("#container").show();  $('#myModal').modal('hide');  ui.updateChart(); break;
				case '2': $('#runmode').text('Automatic'); $("#tab2").hide(); $("#tab3").hide(); $("#tab4").hide(); $("#container").show(); $('#myModal').modal('hide'); break; 
				case '3': $('#runmode').text('Function'); $("#tab2").hide(); $("#tab3").hide(); $("#tab4").show();   $("#container").show(); eventbus.emit("device.update.list", [device_model]); ui.updateChart(); break;
			}
    	});

    	eventbus.on ("ui.update.pressureunit", function (device_model) {
    		temp_device_model = device_model;
			switch (parseInt(device_model.pressureunit)) {
				case 0: $('#unitpressure').text('mbar'); break;
				case 1: $('#unitpressure').text('bar'); break;
				case 2: $('#unitpressure').text('hPa'); break;
				case 3: $('#unitpressure').text('Torr'); break;
			}
    	});

    	

    	eventbus.on ("ui.update.functionrow", function (index, device_model) {
    		temp_device_model = device_model;

			var clock = parseInt(temp_device_model.jashon[index].jso_time);
			var c_date = new Date(clock*1000); 
			var c_hour = parseInt(c_date.getHours())-16;
			var c_minute = c_date.getMinutes();
			var c_second = c_date.getSeconds();
			document.getElementById('tbl').rows[index].cells[0].innerHTML = c_hour+":"+c_minute+":"+c_second;
			document.getElementById('tbl').rows[index].cells[1].innerHTML = temp_device_model.jashon[index].jso_pressure;
			document.getElementById('tbl').rows[index].cells[2].innerHTML = temp_device_model.jashon[index].jso_coolant;  
			
    	});

	};

	exports.setPressureunit = function setPressureunit(data) {
		localeventbus.emit ("device.set.pressureunit", [data])
	};

	exports.setRunmode = function setRunmode(data) {
		localeventbus.emit ("device.set.runmode", [data])
	};

	exports.setVentilation = function setVentilation(data) {
		localeventbus.emit ("device.set.ventilation", [data])
	};

	exports.setCoolant = function setCoolant(data) {
		localeventbus.emit ("device.set.coolant", [data])
	};

	exports.toggleStartstop = function toggleStartstop() {
		if ($('#startstop').hasClass('active')) {
			data = 'E';
		} else {
			data = 'B';
		}
		localeventbus.emit ("device.set.startstop", [data])
	};

	exports.toggleVentilation = function toggleVentilation() {
		if ($('#ventilationbutton').hasClass('active')) {
			data = '0';
		} else {
			data = '1';
		}
		localeventbus.emit ("device.set.ventilation", [data])
	}

	exports.toggleCoolant = function toggleCoolant() {
		if ($('#coolantbutton').hasClass('active')) {
			data = '0';
		} else {
			data = '1';
		}
		localeventbus.emit ("device.set.coolant", [data])
	}


exports.power_select = function power_select() 
	{
		
			var person=prompt("enter pump power","100");
			if (person!=null && person!="")
  			{
  				var x= parseInt(person);
  				if(x<=100 && x>=0)
  				{
  					localeventbus.emit ("device.set.power", [x])
  				}
  			}
  			document.getElementById($('#textb').blur()); 
	}

	exports.pressure_select = function pressure_select() 
	{
		var person2=prompt("enter pump pressure setpoint","100");
		if (person2!=null && person2!="")
  		{
  			var y= parseInt(person2);
  			if(y>=0)
  			{
  				localeventbus.emit ("device.set.pressure", [y])
  			}
  		}
  		document.getElementById($('#textb2').blur()); 	
	}

	exports.edit_cell = function edit_cell(row) 
	{
		var t_row = row;
		 document.getElementById("j_t").value =  temp_device_model.jashon[t_row].jso_time;
		  document.getElementById("j_p").value =  temp_device_model.jashon[t_row].jso_pressure;
		   document.getElementById("j_c").value = temp_device_model.jashon[t_row].jso_coolant; 



		   //document.getElementById("r_t").value = temp_device_model.jashon[t_row].jso_time; 
		   //document.getElementById("r_p").value = temp_device_model.jashon[t_row].jso_pressure; 
		    
		 $('#row').val(parseInt(row)); 
		 $('#myModal').modal('show');
		 g_row = row;
		 if(temp_device_model.jashon[t_row].jso_coolant == 10)
		 {
		 			 document.getElementById('rad2').checked = true;
		 }
		 else
		 {
		 			 document.getElementById('rad').checked = true;
		 			 document.getElementById("j_coo").style.visibility="visible";
		 }
		// $('#myModal').modal('show');
		//var prompty = prompt("enter value","0");
  		//localeventbus.emit ("device.set.pressure", [row],[column],[prompty]);

  	}


	exports.inc_func = function inc_func() 
	{
		// $('#myModal').modal('show');
		//var prompty = prompt("enter value","0");
  		//localeventbus.emit ("device.set.pressure", [row],[column],[prompty]);
  		for(i=0;i<12;i++)
  		{
  		localeventbus.emit ("device.set.inc_func", [i]);
  		}
  		
  	}

  	exports.save_row = function save_row() 
	{
		 g_row = document.getElementById('row').value; 
		 var temp = g_row;
		 
		 //xjason[temp].jso_time

		 var time_copier = $("input#j_t").val();
		 //xjason[temp].jso_pressure 
		 var pressure_copier= $("input#j_p").val();
		 //xjason[temp].jso_coolant 
		 var coolant_copier = $("input#j_c").val();

		 var q3 = parseInt(coolant_copier);
		 var q2 = parseInt(pressure_copier);
		 var q1 = parseInt(time_copier);
		 document.getElementById('rad').checked = true;
		 localeventbus.emit ("device.set.function", [temp, time_copier, pressure_copier, coolant_copier]);
		
		 //console.log(jason);
		 // $('#myModal').modal('show')
		 //var prompty = prompt("enter value","0");
  		 //localeventbus.emit ("device.set.pressure", [row],[column],[prompty]);

  	}

  	
  	exports.delete1 = function delete1() 
	{
		 g_row = document.getElementById('row').value; 
		 for(i=g_row ; i<12 ; i++)
		 {
			//xjason[i].jso_time = xjason[i+1].jso_time;
			//xjason[i].jso_pressure = xjason[i+1].jso_pressure;
			//xjason[i].jso_coolant = xjason[i+1].jso_coolant;
		 }
		 //xjason[11].jso_time = "";
		 //xjason[11].jso_pressure = "";
		 //xjason[11].jso_coolant = "";

		  localeventbus.emit ("device.del1.function", [g_row]);
		   alert('deleted');
  	}

  	exports.deleteAll = function deleteAll() 
	{
		g_row = document.getElementById('row').value; 
		 for(i=g_row ; i<12 ; i++)
		 {
		 //xjason[i].jso_time = "";
		 //xjason[i].jso_pressure = "";
		 //xjason[i].jso_coolant = "";
		 }
		  localeventbus.emit ("device.delAll.function", [g_row]);
		  alert('deleted');
  	}

  	exports.handleChange2 = function handleChange2() 
	{
		 document.getElementById("j_coo").style.visibility="hidden";
		 document.getElementById("j_c").value="10";
		 document.getElementById('rad2').checked = true;
  	}
  	exports.handleChange1 = function handleChange1() 
	{
		 document.getElementById("j_coo").style.visibility="visible";

		 //document.getElementById("j_c").value="10";
  	}
  	

exports.updateChart = function () {


var myrow = new Array();
var mycell = new Array();
myrow[0] = parseInt(temp_device_model.jashon[0].jso_time);
mycell[0] = parseInt(temp_device_model.jashon[0].jso_pressure);
for(i=1;i<12;i++)
{
	myrow[i]= myrow[i-1] + parseInt(temp_device_model.jashon[i].jso_time);
	mycell[i]=  parseInt(temp_device_model.jashon[i].jso_pressure);
}

        $('#container').highcharts({
            chart: {
                type: 'spline' , 
                animation: false
            },
            title: {
                text: 'Pressure vs time'
            },
            subtitle: {
                text: 'An example of irregular time data in Highcharts JS'
            },
            xAxis: {
                type: 'datetime',
                dateTimeLabelFormats: { // don't display the dummy year
                    //month: '%e. %b',
                    //year: '%b',
                    hour: '%H:%M',
                    //second: '%H:%M:%S',
					//minute: '%H:%M'
                }
            },
            yAxis: {
                title: {
                    text: 'Pressure (m)'
                },
                min: 0
            },
            tooltip: {
                formatter: function() {
                        return '<b>'+ this.series.name +'</b><br/>'+
                        Highcharts.dateFormat('%H:%M:%S', this.x*1000) +': '+ this.y +' m';
                }
            },
            
            series: [{
                name: 'Function',
                animation: false ,
                // Define the data points. All series have a dummy year
                // of 1970/71 in order to be compared on the same x axis. Note
                // that in JavaScript, months start at 0 for January, 1 for February etc.
                data: [
                		[myrow[0], mycell[0]],
                		[myrow[1], mycell[1]],
                		[myrow[2], mycell[2]],
                		[myrow[3], mycell[3]],
                		[myrow[4], mycell[4]],
                		[myrow[5], mycell[5]],
                		[myrow[6], mycell[6]],
                		[myrow[7], mycell[7]],
                		[myrow[8], mycell[8]],
                		[myrow[9], mycell[9]],
                		[myrow[10], mycell[10]],
                		[myrow[11],mycell[11]]
                ]
            }, {
                name: 'Data',
                animation: false ,
                // Define the data points. All series have a dummy year
                // of 1970/71 in order to be compared on the same x axis. Note
                // that in JavaScript, months start at 0 for January, 1 for February etc.
                data: [
                		[0, mycell[0]],
                		[60, mycell[1]],
                		[120, mycell[2]],
                		[myrow[3], mycell[3]],
                		[myrow[4], mycell[4]],
                		[myrow[5], mycell[5]],
                		[myrow[6], mycell[6]],
                		[myrow[7], mycell[7]],
                		[myrow[8], mycell[8]],
                		[myrow[9], mycell[9]],
                		[myrow[10], mycell[10]],
                		[myrow[11],mycell[11]]
                ]
            },  ]
        });
	
}


})(typeof exports == 'undefined'? this['ui'] = {}: exports);