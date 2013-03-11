var events = require('events');
var util = require ('util');

function EventBus() {
  events.EventEmitter.call(this);
}

EventBus.super_ = events.EventEmitter;
EventBus.prototype = Object.create (events.EventEmitter.prototype, {
  constructor: {
    value: EventBus,
	enumerable: false
  }
});

module.exports = EventBus;