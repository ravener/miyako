const Event = require("../structures/Event.js");

class EventError extends Event {
  run(event, err) {
    this.client.log.error(err);
  }
}

module.exports = EventError;
