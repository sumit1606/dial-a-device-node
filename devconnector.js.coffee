x = require './XMLHttpRequest.js'

wsr = require './websocket_rails.js.coffee'
ev = require './event.js.coffee'
htpc = require './http_connection.js.coffee'
wsc = require './websocket_connection.js.coffee'
ch = require './channel.js.coffee'
ev = require 'events'
util = require 'util'

SerialPortR = require 'serialport'
SerialPort = SerialPortR.SerialPort

serialPort = new SerialPort '/dev/ttyUSB0',
  baudrate: 9600
#  parser: SerialPortR.parsers.readline String.fromCharCode(13)

serialPort.on "open", ->
  console.log "open serial port"

  dispatcher = new WebSocketRails 'http://www.dial-a-device.com/websocket'
  
  channel = dispatcher.subscribe 'channel_dev_3'

  channel.bind 'device_sendmessage', (data) ->
    console.log 'send message: ' + JSON.stringify data
    serialPort.write  data+String.fromCharCode(13), (err, results) ->
      channel.trigger 'device_reply', {'write success': results}

  channel.bind 'device_error', (data) ->
    console.log 'device error: ' + JSON.stringify data

  channel.bind 'device_reply', (data) ->
    console.log 'device reply: ' + JSON.stringify data

  channel.bind 'client_connected', (data) ->
    console.log 'new client: ' + JSON.stringify data

  channel.trigger 'client_connected', 'hello'

  serialPort.on 'data', (data) ->
    console.log data
    channel.trigger 'device_reply', data


