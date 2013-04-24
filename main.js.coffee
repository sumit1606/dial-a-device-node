# ---------------IMPORT----------------

require './websocket_rails/websocket_rails.js.coffee'
require './websocket_rails/event.js.coffee'
require './websocket_rails/http_connection.js.coffee'
require './websocket_rails/websocket_connection.js.coffee'
require './websocket_rails/channel.js.coffee'


util = require 'util'

ev = require 'events'

http = require 'http'

# ---------------INIT--------------

# do we have a unique id?
# NO create one and save it on disk.

unique_id = 'gf638h2g7g86g3'

# can we get device settings from main URL?
# YES

# settings = require ('http://localhost:3000/connect/' + unique_id + '.json')

# console.log settings

# NO
#   do we have local copy of device settings?
#     NO force simulation mode
#     YES
#       standalone mode?
#         YES do we have local copy of UI?
#           NO download it as well
#           start webserver
#       
# do we have a local copy of the device js file?
# NO download it from URL
#
# require (import) device specific js file

device_type = 'knf-sc920'

device_library = './devices/knf-sc920.js'
device = require device_library
simulation = require './devices/knf-sc920_SIM.js'

ser_string = '/dev/ttyACM0'
ser_baud = 115200
device_id = 3

url_string = 'http://localhost:3000/websocket'

# ---------------CONNECT-------------


deviceconnection = require './deviceconnection.js'
webconnection = require './webconnection.js'
consolelogger = require './consolelogger.js'
status = require './systemstatus.js'

eventbus = new ev.EventEmitter

status.init (eventbus)

webconnection.init eventbus, true
webconnection.initsubscribe

eventbus.emit "device.announce.deviceid", [device_id]
eventbus.emit "device.announce.devicetype", [device_type]

device.init (eventbus)
consolelogger.init (eventbus)


deviceconnection.init (eventbus)
eventbus.emit "serial.set.baud", [ser_baud]
eventbus.emit "serial.set.port", [ser_string]

eventbus.emit "serial.connect"

eventbus.emit "webconnection.set.channelname", ['channel_dev_' + device_id]
eventbus.emit "webconnection.set.url", [url_string]
eventbus.emit "webconnection.set.deviceendpoint", [true]

eventbus.emit "webconnection.connect"

simulation.init (eventbus)

# ------------------------------------------------------

# eventbus.on "ui.update.status", (devmodel) ->
#   console.log devmodel


heartbeat = ->
  eventbus.emit "device.heartbeat"

setInterval heartbeat, 1000

# ------------------ background worker task -------------

http.createServer((req, res) ->
  
).listen 9615