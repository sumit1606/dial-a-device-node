dial-a-device-node
==================

This package contains a gem AND a npm package AND a standalone node.js application.

## Installation in node.js (Ubuntu Linux)

Install the latest node.js and node package manager

	sudo apt-get install software-properties-common python-software-properties
	sudo add-apt-repository ppa:chris-lea/node.js
	sudo apt-get update
	sudo apt-get install nodejs git-core curl build-essential openssl libssl-dev coffeescript

Install the packages manually for development use: Download the dial-a-device-node source code and the required packages

	sudo git clone https://github.com/Cominch/dial-a-device-node.git
	
	sudo npm install -g coffee-script
	sudo npm install -g serialport
	sudo npm install -g websocket
	sudo npm install -g bonescript
	sudo npm install -g getmac

Go! on Linux

	Make sure your user is in the dialout group or give full access to your serial port

		sudo chmod 777 /dev/ttyUSB0

	Edit start.js

		Define your serial port and websocket URL, if you don't want to use the default values

	Run the dial-a-device-node client

		node start.js

## Installation on BeagleBone (Angstrom Linux) for development

Install required OS packages

	opkg update
	opkg install python-compiler
	opkg install python-misc
	opkg install python-multiprocessing

Install the npm package
	
	npm update
	npm install -g coffee-script
	npm install -g serialport
	npm install -g websocket
	npm install -g bonescript
	npm install -g getmac

	cd /var/lib/cloud9

	env GIT_SSL_NO_VERIFY=true git clone https://github.com/Cominch/dial-a-device-node

	cd /var/lib/cloud9/dial-a-device-node

	npm install

	node start.js

You can access and modify the source code via the cloud9 editor on your BeagleBone:

	http://192.168.7.2:3000


## Installation as part of a Ruby on Rails project (gem)

Add this line to your application's Gemfile:

    gem 'dial_a_device_node'

Change these settings in /config/environments/production.rb

    config.serve_static_assets = true
    config.assets.compress = false
    config.assets.compile = true

And then execute:

    $ bundle

Or install it yourself as:

    $ gem install dial_a_device_node


## License

GPLv3
