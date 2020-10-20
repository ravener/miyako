const Event = require("../structures/Event.js");

class MessageEvent extends Event {

  async run(msg) {
    return this.client.monitors.run(msg);
  }
}

module.exports = MessageEvent;
