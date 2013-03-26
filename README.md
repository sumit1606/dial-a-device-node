dial-a-device-node
==================

* Install the latest node.js and node package manager

		sudo add-apt-repository ppa:chris-lea/node.js
		sudo apt-get update
		sudo apt-get install python-software-properties nodejs git-core curl build-essential openssl libssl-dev npm coffeescript

* Download the dial-a-device-node source code and the required packages

		sudo git clone https://github.com/Cominch/dial-a-device-node.git
		cd dial-a-device-node
		sudo npm install coffee-script
		sudo npm install serialport

* Go!

	Make sure your user is in the dialout group or give full access to your serial port

		sudo chmod 777 /dev/ttyUSB0

	Edit main.js.coffee

		Define your serial port and websocket URL, if you don't want to use the default values

	Run the dial-a-device-node client

		coffee main.js.coffee