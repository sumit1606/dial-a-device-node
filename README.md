dial-a-device-node
==================

* Install the latest node.js

		sudo apt-get install python-software-properties
		sudo add-apt-repository ppa:chris-lea/node.js
		sudo apt-get update
		sudo apt-get install nodejs

* Install npm, the node package manager

		sudo apt-get install git-core curl build-essential openssl libssl-dev
		sudo apt-get install npm coffeescript

* Download the dial-a-device-node source code and the required packages

		sudo git clone https://github.com/Cominch/dial-a-device-node.git
		cd dial-a-device-node
		sudo npm install coffee-script
		sudo npm install serialport

* Run the dial-a-device-node client

		coffee main.js.coffee