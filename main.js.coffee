x = require './XMLHttpRequest.js'

wsr = require './websocket_rails.js.coffee'
ev = require './event.js.coffee'
htpc = require './http_connection.js.coffee'
wsc = require './websocket_connection.js.coffee'

ch = require './channel.js.coffee'

ev = require 'events'
util = require 'util'



dialadevicenode = require './dial-a-device-node.js'

device = require './device.js'

eventbus = new ev.EventEmitter

dialadevicenode.websockets

dialadevicenode.init (eventbus)

device.init (eventbus)

serialport = dialadevicenode.openserialport '/dev/ttyUSB0', 9600

connect = ->
  dialadevicenode.webconnect "http://localhost:3000/websocket"

eventbus.on "serialport_opened", ->
  console.log "serial port opened"
  setTimeout connect, 1000
  
eventbus.on "serial_received", (lm, data) ->
  device.serialdata lm, data

eventbus.on "initialized", ->
  console.log "initialized"
  
eventbus.on "writenext", ->
  setTimeout dialadevicenode.writenext, 100
  
eventbus.on "connecting", (url) ->
  console.log "connecting to " + url

eventbus.on "connected", (url) ->
  console.log "connected to "+ url
  channel = dialadevicenode.subscribe 'channel_dev_1'
  
eventbus.on "subscribing", (channelname) ->
  console.log "subscribing to "+ channelname

eventbus.on "device_received", (lm, data) ->
  # console.log (JSON.stringify (lm)+' --- '+data);
  channel.trigger 'device_reply', {'lastmessage': lm, 'response': data}

eventbus.on "device_log", (lm, data) ->
  console.log (JSON.stringify (lm)+' --- '+data);
  dialadevicenode.trigger 'device_log', {'lastmessage': lm, 'response': data}

eventbus.on "connectionclosed", () ->
  console.log "connection closed"
  setTimeout connect, 1000
  
eventbus.on "channelsubscription", (channelname, channel) ->
  console.log "subscribed to "+channelname
  
  
  
  heartbeat = ->
    channel.trigger 'device_sendmessage', {'commandtype': 'heartbeat', 'command': 'pP'}
    channel.trigger 'device_sendmessage', {'commandtype': 'heartbeat', 'command': 'gM'}
    channel.trigger 'device_sendmessage', {'commandtype': 'heartbeat', 'command': 'gUp'}
    channel.trigger 'device_sendmessage', {'commandtype': 'heartbeat', 'command': 'gV'}
    channel.trigger 'device_sendmessage', {'commandtype': 'heartbeat', 'command': 'gW'}

  channel.bind 'device_sendmessage', (data) ->
    console.log 'send message: ' + JSON.stringify data	
    dialadevicenode.writedata data

  channel.bind 'device_error', (data) ->
    console.log 'device error: ' + JSON.stringify data

  channel.bind 'device_reply', (data) ->
    console.log 'device reply: ' + JSON.stringify data

  channel.trigger 'client_connected', 'dial-a-device-node'
  
  setInterval heartbeat, 1000
 
  
