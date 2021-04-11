const Event = require("../structures/Event.js");

class MessageUpdate extends Event {
  async run(old, msg) {
    if (old.content !== msg.content) return this.client.monitors.run(msg);
  }
}

module.exports = MessageUpdate;
