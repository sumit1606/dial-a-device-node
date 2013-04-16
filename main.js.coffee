# ---------------IMPORT----------------

require './websocket_rails/websocket_rails.js.coffee'
require './websocket_rails/event.js.coffee'
require './websocket_rails/http_connection.js.coffee'
require './websocket_rails/websocket_connection.js.coffee'
require './websocket_rails/channel.js.coffee'

ev = require 'events'


# ---------------INIT--------------

# do we have a unique id?
# NO create one and save it on disk.

# get unique id

# can we get device settings from main URL?
# NO
#   do we have local copy of device settings?
#     NO force simulation mode
#     YES
#       standalone mode?
#         YES do we have local copy of UI?
#           NO download it as well
#           start webserver
#       
# YES use local device settings, initalize the device
#
# port, device_type, channel, simulation yes/no
#
# do we have a local copy of the device js file?
# NO download it from URL
#
# require (import) device specific js file


# -----------------------------------

ser_string = '/dev/ttyUSB0'
# ser_string = 'COM3'

simulation = true

url_string = 'http://www.dial-a-device.com/websocket'

# ---------------CONNECT-------------


deviceconnection = require './deviceconnection.js'

webconnection = require './webconnection.js'

device = require './device_knf920.js'

consolelogger = require './consolelogger.js'

eventbus = new ev.EventEmitter

webconnection.websockets

deviceconnection.init (eventbus)

webconnection.init (eventbus)

device.init (eventbus)

consolelogger.init (eventbus)

serialport = deviceconnection.openserialport ser_string, 115200

connect = ->
  webconnection.webconnect url_string


# -----------------------------------

eventbus.on "serialport_opened", ->
  setTimeout connect, 1000

eventbus.on "writenext", ->
  setTimeout deviceconnection.writenext, 100


eventbus.on "connected", (url) ->
  channel = webconnection.subscribe 'channel_dev_3'

eventbus.on "device_received", (lm, data) ->
  channel.trigger 'device_reply', {'lastmessage': lm, 'response': data}

eventbus.on "device_log", (lm, data) ->
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
 
  
