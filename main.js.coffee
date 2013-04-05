ser_string = '/dev/ttyUSB0'
# ser_string = 'COM3'

simulation = false;

url_string = 'http://localhost:3000/websocket'

# --------------------------------------

require './websocket_rails/websocket_rails.js.coffee'
require './websocket_rails/event.js.coffee'
require './websocket_rails/http_connection.js.coffee'
require './websocket_rails/websocket_connection.js.coffee'
require './websocket_rails/channel.js.coffee'

ev = require 'events'


deviceconnection = require './deviceconnection.js'

webconnection = require './webconnection.js'

device = require './device.js'

consolelogger = require './consolelogger.js'

eventbus = new ev.EventEmitter

webconnection.websockets

deviceconnection.init (eventbus)

webconnection.init (eventbus)

device.init (eventbus)

consolelogger.init (eventbus)

serialport = deviceconnection.openserialport ser_string, 9600

connect = ->
  webconnection.webconnect url_string

eventbus.on "serialport_opened", ->
  setTimeout connect, 1000

eventbus.on "writenext", ->
  setTimeout deviceconnection.writenext, 100


eventbus.on "connected", (url) ->
  channel = webconnection.subscribe 'channel_dev_1'

eventbus.on "device_received", (lm, data) ->
  channel.trigger 'device_reply', {'lastmessage': lm, 'response': data}

eventbus.on "device_log", (lm, data) ->
  console.log (JSON.stringify (lm)+' --- '+data);
  webconnection.trigger 'device_log', {'lastmessage': lm, 'response': data}

eventbus.on "connectionclosed", () ->
  setTimeout connect, 1000

 
eventbus.on "channelsubscription", (channelname, channel) ->
    
  eventbus.on "channel.send", (cmd, data) ->
    channel.trigger cmd, data
  
  heartbeat = ->

    eventbus.emit "device.requestheartbeat"

  heartbeatsimulation = ->
    eventbus.emit "device.requestheartbeat.simulation"

  channel.bind 'device_sendmessage', (data) ->
    console.log 'send message: ' + JSON.stringify data	
    deviceconnection.writedata data

  channel.bind 'device_error', (data) ->
    console.log 'device error: ' + JSON.stringify data

  channel.bind 'device_reply', (data) ->
    console.log 'device reply: ' + JSON.stringify data

  channel.trigger 'client_connected', 'dial-a-device-node'
  
  setInterval heartbeat, 1000 if !simulation

  setInterval heartbeatsimulation, 1000 if simulation
 
  
