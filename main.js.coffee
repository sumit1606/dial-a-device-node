x = require './XMLHttpRequest.js'

wsr = require './websocket_rails.js.coffee'
ev = require './event.js.coffee'
htpc = require './http_connection.js.coffee'
wsc = require './websocket_connection.js.coffee'
ch = require './channel.js.coffee'
ev = require 'events'
util = require 'util'



dialadevicenodelib = require './dial-a-device-node.js'

eventbus = new ev.EventEmitter

dialadevicenode = new dialadevicenodelib.Master (eventbus)

# dialadevicenode.defineserialport 'COM3', 9600

# dispatcher = new WebSocketRails dialadevicenode.url
  
# dialadevicenode.setwebsockets dispatcher



eventbus.on "portopened", ->

  lastmessage = new Array
  console.log "open serial port"

  channel = dispatcher.subscribe 'channel_dev_1'
  
  heartbeat = ->
    channel.trigger 'device_sendmessage', {'commandtype': 'heartbeat', 'command': 'pP'}
    channel.trigger 'device_sendmessage', {'commandtype': 'heartbeat', 'command': 'gM'}
    channel.trigger 'device_sendmessage', {'commandtype': 'heartbeat', 'command': 'gUp'}

  channel.bind 'device_sendmessage', (data) ->
    console.log 'send message: ' + JSON.stringify data	
    lastmessage.push (data)	
    dialadevicenode.serialport.write  data.command+String.fromCharCode(13), (err, results) ->
      # channel.trigger 'device_reply', {'write success': results}
      # if data.commandtype != 'heartbeat'
      #   heartbeat

  channel.bind 'device_error', (data) ->
    console.log 'device error: ' + JSON.stringify data

  channel.bind 'device_reply', (data) ->
    console.log 'device reply: ' + JSON.stringify data

  channel.bind 'client_connected', (data) ->
    console.log 'new client: ' + JSON.stringify data

  channel.trigger 'client_connected', 'dial-a-device-node'

  dialadevicenode.serialport.on 'data', (data) ->
    console.log data
    channel.trigger 'device_reply', {'lastmessage': lastmessage.pop(), 'response': data}
  
  
  
  setInterval heartbeat, 1000